"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { fetchQuestionDetails, voteQuestion } from "@/services/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, User, Share2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { WithAuth } from "@/hoc/withAuth";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  text: string;
  createdBy: string;
  votes: { [key: string]: boolean };
}

function QuestionDetails() {
  const { sessionId, questionId } = useParams();
  const sessionIdStr = Array.isArray(sessionId) ? sessionId[0] : sessionId;
  const questionIdStr = Array.isArray(questionId) ? questionId[0] : questionId;
  const { user } = useAuth();
  const userId = user?.uid;

  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestionDetailsAsync = async () => {
      try {
        const questionData = await fetchQuestionDetails(
          sessionIdStr,
          questionIdStr
        );
        setQuestion(questionData);
      } catch (error) {
        console.error("Erro ao buscar detalhes da pergunta:", error);
        router.push(`/sessions/${sessionIdStr}`);
      } finally {
        setLoading(false);
      }
    };

    if (sessionIdStr && questionIdStr) {
      fetchQuestionDetailsAsync();
    }
  }, [sessionIdStr, questionIdStr, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#560bad]"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Pergunta não encontrada.</p>
      </div>
    );
  }

  const handleVote = async () => {
    setVoting(true);
    try {
      await voteQuestion(sessionIdStr, question.id);

      setQuestion((prevQuestion) => {
        if (!prevQuestion) return null;

        const updatedVotes = { ...prevQuestion.votes };
        if (userId) {
          if (updatedVotes[userId]) {
            delete updatedVotes[userId];
          } else {
            updatedVotes[userId] = true;
          }
        }

        return { ...prevQuestion, votes: updatedVotes };
      });
    } catch (error) {
      console.error("Erro ao votar na pergunta", error);
      toast({
        title: "Erro",
        description: `Falha ao votar. Por favor, tente novamente`,
        variant: "destructive",
      });
    } finally {
      setVoting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Veja esta pergunta no QRious",
        text: `Pergunta: "${question.text}"`,
        url: window.location.href,
      });
    } else {
      toast({
        title: "Informação de compartilhamento",
        description: "Seu navegador não suporta o compartilhamento nativo.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 pt-28 pb-12 max-w-3xl">
        <Button
          onClick={() => router.back()}
          className="bg-transparent hover:bg-[#560bad] text-black hover:text-white  mb-6"
        >
          <ArrowLeft className="mr-2 md:mt-0.5 h-4 w-4" /> Voltar
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#560bad]">
                Detalhes da Pergunta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-800 mb-4 break-words">
                {question.text}
              </p>
              <div className="flex items-center space-x-2 text-gray-500">
                <User className="w-4 h-4" />
                <span className="font-medium">{question.createdBy}</span>
              </div>
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  className={`flex items-center space-x-1 ${
                    question.votes && userId && question.votes[userId]
                      ? "bg-[#9e49ff] text-white"
                      : "text-[#560bad] hover:bg-[#560bad] hover:text-white"
                  } transition-colors duration-300`}
                  onClick={handleVote}
                  disabled={voting}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{Object.keys(question.votes || {}).length}</span>
                </Button>

                <Button
                  className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default WithAuth(QuestionDetails);
