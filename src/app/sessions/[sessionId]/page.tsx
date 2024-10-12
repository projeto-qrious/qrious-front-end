"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getSessionDetails } from "@/services/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
      votes: number;
    };
  };
}

export default function DetalhesSessao() {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const buscarDetalhesSessao = async () => {
        try {
          const sessionData = await getSessionDetails(sessionId as string);
          setSession(sessionData);
        } catch (error) {
          console.error("Erro ao buscar detalhes da sessão:", error);
          router.push("/home");
        } finally {
          setLoading(false);
        }
      };
      buscarDetalhesSessao();
    }
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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 pt-28 flex flex-col items-center max-w-5xl">
        <div className="w-full">
          {/* SECTION FAZER PERGUNTA */}
          <section className="pb-12">
            <Card>
              <CardTitle className="text-xl pl-6 pt-6 font-semibold mb-4 text-[#560bad]">
                Faça sua pergunta
              </CardTitle>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Textarea
                      id="sessionDescription"
                      // value={sessionDescription}
                      // onChange={(e) => setSessionDescription(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                  >
                    Perguntar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* SECTION PERGUNTAS */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[#560bad]">
              Perguntas
            </h2>
            <div className="space-y-4">
              {session?.questions &&
                Object.values(session.questions).map((question) => (
                  <Card
                    key={question.id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <CardContent className="p-4">
                      <p className="text-lg mb-2 text-gray-800">
                        {question.text}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By: {question.createdBy}</span>
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1 text-[#560bad]" />
                          <span>{question.votes || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
          <section className="flex flex-col md:flex-row md:justify-between gap-12 mb-10 pt-20">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-black">
                <CardTitle className="text-2xl font-bold">
                  {session?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{session?.description}</p>
              </CardContent>

              {/* CARD QRCODE */}
            </Card>
            <Card className="bg-white shadow-lg p-8 md:p-2 w-full md:w-52 justify-self-center flex flex-col items-center justify-center">
              <CardContent className="space-y-2 flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {session.qrcode ? (
                    <div className="p-0 border-2 border-gray-300 rounded-lg shadow-lg">
                      <img
                        src={session.qrcode}
                        alt="QR Code da Sessão"
                        className="mx-auto w-full h-full"
                      />
                    </div>
                  ) : (
                    <p className="text-red-500">QR Code não disponível</p>
                  )}
                  <p className="text-base text-gray-800 font-semibold text-center bg-gray-200 px-6 py-2 rounded-md shadow-md">
                    <span className="text-lg text-[#560bad] font-bold">
                      {session.sessionCode}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
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
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
