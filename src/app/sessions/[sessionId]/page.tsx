"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import {
  createQuestion,
  getSessionDetails,
  voteQuestion,
  markQuestionAsAnswered,
} from "@/services/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, User, Share2, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WithAuth } from "@/hoc/withAuth";
import GoBack from "@/components/goBack";
import { useToast } from "@/hooks/use-toast";
import { onValue, ref, DatabaseReference, off } from "firebase/database";
import { firebaseDatabase } from "@/configs/firebaseconfig";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { deleteQuestion } from "@/services/sessions";

interface Question {
  id: string;
  text: string;
  createdBy: string;
  votes: {
    [key: string]: boolean;
  };
  answered: boolean;
}

interface Session {
  sessionCode: string;
  qrcode: string;
  title: string;
  description: string;
  questions?: {
    [key: string]: Question;
  };
}

function SessionDetails() {
  const { role, user } = useAuth();
  const userId = user?.uid;
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const sortedQuestions = useMemo(() => {
    if (session?.questions) {
      return Object.values(session.questions).sort((a, b) => {
        // First, sort by answered status
        if (a.answered && !b.answered) return 1;
        if (!a.answered && b.answered) return -1;
        // Then, sort by votes
        const votesA = a.votes ? Object.keys(a.votes).length : 0;
        const votesB = b.votes ? Object.keys(b.votes).length : 0;
        return votesB - votesA;
      });
    }
    return [];
  }, [session?.questions]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createQuestion(sessionId, newQuestion);

      toast({
        title: "Sucesso!",
        description: `Pergunta criada com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao adicionar uma pergunta", error);
      toast({
        title: "Erro",
        description: `Falha ao criar a pergunta. Por favor, tente novamente`,
        variant: "destructive",
      });
    } finally {
      setNewQuestion("");
      setSubmitting(false);
    }
  };

  const handleVote = async (questionId: string) => {
    try {
      await voteQuestion(sessionId, questionId);
    } catch (error) {
      console.error("Erro ao votar na pergunta", error);
      toast({
        title: "Erro",
        description: `Falha ao votar na pergunta. Por favor, tente novamente`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    if (confirm("Você tem certeza que deseja excluir esta pergunta?")) {
      try {
        await deleteQuestion(sessionId, questionId);
        toast({
          title: "Sucesso!",
          description: "Pergunta excluída com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao excluir a pergunta", error);
        toast({
          title: "Erro",
          description:
            "Falha ao excluir a pergunta. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCheck = async (questionId: string) => {
    try {
      await markQuestionAsAnswered(sessionId, questionId);
      toast({
        title: "Sucesso!",
        description: "Pergunta marcada como respondida.",
      });
    } catch (error) {
      console.error("Erro ao marcar a pergunta como respondida", error);
      toast({
        title: "Erro",
        description:
          "Falha ao marcar a pergunta como respondida. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  let sessionRef: DatabaseReference | null = null;
  useEffect(() => {
    if (sessionId) {
      const fetchSessionDetails = async () => {
        try {
          const sessionData = await getSessionDetails(sessionId as string);
          setSession(sessionData);

          // Set up real-time listener for questions
          sessionRef = ref(firebaseDatabase, `sessions/${sessionId}/questions`);
          onValue(sessionRef, (snapshot) => {
            const questionsData = snapshot.val();
            if (questionsData) {
              setSession((prevSession) => {
                if (!prevSession) return null;

                return {
                  ...prevSession,
                  questions: questionsData,
                };
              });
            }
          });
        } catch (error) {
          console.error("Erro ao buscar detalhes da sessão:", error);
          router.push("/home");
        } finally {
          setLoading(false);
        }
      };
      fetchSessionDetails();
    }

    // Cleanup listener on unmount
    return () => {
      if (sessionRef) {
        off(sessionRef);
      }
    };
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#560bad]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Sessão não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 pt-28 pb-12 max-w-5xl">
        <GoBack />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna Direita: Fazer Pergunta e Lista de Perguntas */}
          <div className="md:col-span-2 space-y-6 order-1 md:order-2">
            {/* Seção Fazer Pergunta */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#560bad]">
                  Faça sua pergunta ou curta as perguntas abaixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <Textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Digite sua pergunta aqui..."
                    required
                    className="border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                    disabled={submitting}
                  >
                    {submitting ? "Enviando..." : "Enviar Pergunta"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Seção Lista de Perguntas */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#560bad]">
                  Perguntas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  layout
                  className="space-y-4 max-h-[400px] overflow-y-auto"
                >
                  <AnimatePresence>
                    {sortedQuestions.length > 0 ? (
                      sortedQuestions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          layoutId={question.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          style={{
                            zIndex: sortedQuestions.length - index,
                          }}
                        >
                          <Link
                            href={`/sessions/${sessionId}/questions/${question.id}`}
                          >
                            <Card
                              className={`bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 relative ${
                                question.answered
                                  ? "border-l-4 border-green-500"
                                  : ""
                              }`}
                            >
                              <CardContent className="p-4 pt-10">
                                {/* Verifica se o usuário é "SPEAKER" para mostrar os botões */}
                                {role === "SPEAKER" && (
                                  <div className="absolute top-2 right-2 flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-8 w-8 ${
                                        question.answered
                                          ? "text-white bg-green-600 hover:bg-green-700"
                                          : "text-green-600 hover:text-white hover:bg-green-600"
                                      }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCheck(question.id);
                                      }}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-600 hover:text-white hover:bg-red-600"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDelete(question.id);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                <p className="text-lg mb-2 text-gray-800 line-clamp-3 break-words">
                                  {question.text}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                  <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">
                                      {question.createdBy}
                                    </span>
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={`flex items-center space-x-1 ${
                                      question.votes &&
                                      userId &&
                                      question.votes[userId]
                                        ? "bg-[#9e49ff] text-white"
                                        : "text-[#560bad] hover:bg-[#560bad] hover:text-white"
                                    } transition-colors duration-300`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleVote(question.id);
                                    }}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>
                                      {question.votes
                                        ? Object.keys(question.votes).length
                                        : 0}
                                    </span>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card className="bg-gray-50 shadow-sm">
                          <CardContent className="p-4">
                            <p className="text-lg text-gray-600 text-center">
                              Ainda não há perguntas. <br /> Seja o primeiro a
                              perguntar!
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Esquerda: Informações da Sessão e QR Code */}
          <div className="md:col-span-1 space-y-6 order-2 md:order-1">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center font-bold text-[#560bad]">
                  {session.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  {session.qrcode ? (
                    <div className="p-2 border-2 border-gray-300 rounded-lg shadow-lg">
                      <img
                        src={session.qrcode}
                        alt="Session QR Code"
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <p className="text-red-500">QR Code not available</p>
                  )}
                  <p className="text-base text-gray-800 font-semibold text-center bg-gray-200 px-6 py-2 rounded-md shadow-md">
                    Código:{" "}
                    <span className="text-lg text-[#560bad] font-bold">
                      {session.sessionCode}
                    </span>
                  </p>
                  <Button
                    className="bg-[#560bad] hover:bg-[#3a0ca3] text-white w-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Entre na minha sessão no QRious",
                          text: `Use o código ${session.sessionCode} ou aponte a câmera para o QR code para entrar na minha sessão no QRious.`,
                          url: window.location.href,
                        });
                      } else {
                        alert(
                          "Compartilhamento não é suportado nesse navegador."
                        );
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar Sessão
                  </Button>
                  {role === "SPEAKER" && (
                    <Link
                      href={`/sessions/${sessionId}/view-session`}
                      className="w-full"
                    >
                      <Button className="bg-[#000] hover:bg-[#3a0ca3] text-white w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Modo de Visualização
                      </Button>
                    </Link>
                  )}
                  {/* <Button
                    className="bg-[#000] hover:bg-[#3a0ca3] text-white w-full max-w-[200px]"
                    onClick={toggleShowQuestions}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WithAuth(SessionDetails);
