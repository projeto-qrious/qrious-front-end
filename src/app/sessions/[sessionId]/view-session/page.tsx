"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { getSessionDetails } from "@/services/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, User, Share2, Eye } from "lucide-react"; // Importa o ícone Eye
import { Button } from "@/components/ui/button";
import { WithAuth } from "@/hoc/withAuth";
import GoBack from "@/components/goBack";
import { onValue, ref, DatabaseReference, off } from "firebase/database";
import { firebaseDatabase } from "@/configs/firebaseconfig";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Session {
  sessionCode: string;
  qrcode: string;
  title: string;
  description: string;
  questions?: {
    [key: string]: {
      id: string;
      text: string;
      createdBy: string;
      votes: {
        [key: string]: boolean;
      };
    };
  };
}

function SessionDetails() {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false); // Estado para controlar a visibilidade das perguntas

  const sortedQuestions = useMemo(() => {
    if (session?.questions) {
      return Object.values(session.questions).sort((a, b) => {
        const votesA = a.votes ? Object.keys(a.votes).length : 0;
        const votesB = b.votes ? Object.keys(b.votes).length : 0;
        return votesB - votesA;
      });
    }
    return [];
  }, [session?.questions]);

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

      <main className="container mx-auto px-4 pt-28 pb-12 max-w-8xl">
        <GoBack />
        <div
          className={`grid gap-8 ${
            showQuestions ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 "
          }`}
        >
          {/* Coluna Esquerda: Informações da Sessão e QR Code */}
          <div
            className={`space-y-6 order-2 md:order-1 ${
              showQuestions
                ? "md:col-span-1"
                : "md:col-span-2 lg:col-span-1 justify-self-center max-w-xl"
            }`}
          >
            <Card
              className={`bg-white shadow-lg ${
                showQuestions ? "" : "w-[700px]"
              }`}
            >
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
                    className="bg-[#000] hover:bg-[#3a0ca3] text-white w-full"
                    onClick={() => {
                      setShowQuestions(!showQuestions); // Alterna a visibilidade das perguntas
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showQuestions ? "Esconder Perguntas" : "Mostrar Perguntas"}
                  </Button>
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Fazer Pergunta e Lista de Perguntas */}
          {showQuestions && (
            <div className="md:col-span-2 space-y-6 order-1 md:order-2">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#560bad]">
                    Perguntas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    layout
                    className="space-y-4 max-h-[800px] overflow-y-auto"
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
                              <Card className="bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                                <CardContent className="p-4 pt-10">
                                  <div className="absolute top-2 right-2 flex space-x-2"></div>
                                  <p className="text-lg mb-2 text-black font-semibold line-clamp-3 break-words">
                                    {question.text}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
                                    <span className="flex items-center">
                                      <User className="w-4 h-4 mr-1 flex-shrink-0" />
                                      <span className="truncate max-w-[200px]">
                                        {question.createdBy}
                                      </span>
                                    </span>
                                    <div className="flex items-center space-x-1 text-[#560bad]">
                                      <ThumbsUp className="w-4 h-4" />
                                      <span>
                                        {question.votes
                                          ? Object.keys(question.votes).length
                                          : 0}
                                      </span>
                                    </div>{" "}
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
          )}
        </div>
      </main>
    </div>
  );
}

export default WithAuth(SessionDetails);
