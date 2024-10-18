"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSessionDetails, joinSession } from "@/services/sessions";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/hoc/protectedRoutes";
import GoBack from "@/components/goBack";
import { ArrowRight, Share } from "lucide-react";

interface Session {
  sessionCode: string;
  qrcode: string;
  title: string;
  description: string;
  sessionId: string;
}

const SessionDetails = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionDetailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sessionId) {
      const fetchSessionDetails = async () => {
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
      fetchSessionDetails();
    }
  }, [sessionId, router]);

  const handleJoinSession = async () => {
    const sessionCode = session?.sessionCode;
    if (!sessionCode) return;

    setLoading(true);
    try {
      const { sessionId: returnedSessionId } = await joinSession(
        null,
        sessionCode
      );
      router.push(`/sessions/${returnedSessionId}`);
    } catch (err: unknown) {
      console.error("Erro ao entrar na sessão: ", err);
    } finally {
      setLoading(false);
    }
  };

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

  const sessionURL = `https://qrious-front-end.onrender.com`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-20 md:pt-28 max-w-6xl">
        <GoBack />
        <Card
          ref={sessionDetailsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-8rem)] bg-white shadow-lg m-6"
          id="session-details"
        >
          <div className="flex flex-col justify-center items-center p-6 md:p-10">
            <CardHeader className="text-center w-full">
              <CardTitle className="text-3xl md:text-5xl font-bold mb-4 text-[#560bad]">
                {session.title}
              </CardTitle>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                {session.description}
              </p>
            </CardHeader>
            <div className="text-xl md:text-2xl text-black font-bold text-center leading-tight mb-8">
              Com o QRious, você participa ativamente da palestra e garante que
              as melhores perguntas sejam respondidas!
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
              <Button
                className="bg-[#560bad] hover:bg-[#3a0ca3] text-white text-lg md:text-xl py-4 px-6 w-full sm:w-auto"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Entre na minha sessão no QRious",
                      text: `Use o código ${session.sessionCode} ou aponte a câmera para o QR code para entrar na minha sessão no QRious.`,
                      url: `https://qrious-front-end.onrender.com/sessions/joinqrcode/${session.sessionCode}`,
                    });
                  } else {
                    alert("Compartilhamento não é suportado nesse navegador.");
                  }
                }}
              >
                <Share className="mr-2 h-5 w-5" /> Compartilhar
              </Button>
              <Button
                onClick={handleJoinSession}
                disabled={loading}
                className="bg-black hover:bg-[#3a0ca3] text-white text-lg md:text-xl py-4 px-6 w-full sm:w-auto"
              >
                {loading ? (
                  "Entrando"
                ) : (
                  <>
                    Entrar <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardContent className="flex flex-col items-center justify-center space-y-6 bg-gray-50 p-6 md:p-10 rounded-lg">
            {session.qrcode && (
              <div className="p-4 bg-white rounded-lg shadow-2xl">
                <img
                  src={session.qrcode}
                  alt="QR Code da Sessão"
                  className="w-64 md:w-80 h-auto"
                />
              </div>
            )}
            <p className="text-xl md:text-2xl text-gray-800 font-semibold text-center">
              Código da sessão:{" "}
              <span className="text-2xl md:text-4xl text-[#560bad] font-bold">
                {session.sessionCode}
              </span>
            </p>
            <a
              href={sessionURL}
              className="text-lg md:text-xl text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {sessionURL}
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default function SessionDetailsPage() {
  return (
    <ProtectedRoute>
      <SessionDetails />
    </ProtectedRoute>
  );
}
