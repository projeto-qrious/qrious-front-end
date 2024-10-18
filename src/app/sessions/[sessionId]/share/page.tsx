"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSessionDetails, joinSession } from "@/services/sessions";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/hoc/protectedRoutes";
import GoBack from "@/components/goBack";
import html2pdf from "html2pdf.js";
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

  const handleGenerateAndSharePDF = async () => {
    const element = sessionDetailsRef.current;

    if (element) {
      const buttons = element.querySelectorAll(
        ".no-print"
      ) as NodeListOf<HTMLElement>;
      buttons.forEach((btn) => (btn.style.display = "none"));

      const options = {
        margin: 0,
        filename: "Compartilhar_Sessao.pdf",
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      try {
        const pdfBlob = await html2pdf()
          .set(options)
          .from(element)
          .outputPdf("blob");
        buttons.forEach((btn) => (btn.style.display = ""));

        if (navigator.share) {
          const file = new File([pdfBlob], "compartilhar_sessao.pdf", {
            type: "application/pdf",
          });

          await navigator.share({
            files: [file],
            title: "Compartilhar Sessão",
            text: "Veja o PDF da sessão.",
          });
        } else {
          alert("Compartilhamento não é suportado nesse navegador.");
        }
      } catch (error) {
        console.error("Erro ao gerar ou compartilhar PDF:", error);
      }
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
      <main className="container mx-auto px-4 pt-28 max-w-4xl">
        <GoBack />
        <Card
          ref={sessionDetailsRef}
          className="flex flex-col justify-center items-center min-h-screen bg-white shadow-lg"
          id="session-details"
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-center mb-2 text-[#560bad]">
              {session.title}
            </CardTitle>
            <p className="text-lg text-gray-600">{session.description}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              {session.qrcode ? (
                <div className="p-4 border-2 border-gray-300 rounded-lg shadow-lg">
                  <img
                    src={session.qrcode}
                    alt="QR Code da Sessão"
                    className="mx-auto w-full h-auto"
                  />
                </div>
              ) : (
                <p className="text-red-500">QR Code não disponível</p>
              )}
              <a
                href={sessionURL}
                className="text-blue-500 underline"
                target="_blank"
              >
                {sessionURL}
              </a>
              <p className="text-lg text-gray-800 font-semibold p-2">
                Código da sessão:{" "}
                <span className="text-2xl text-[#560bad] font-bold">
                  {session.sessionCode}
                </span>
              </p>
            </div>

            <div className="flex justify-center space-x-4 no-print">
              <Button
                className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                onClick={handleGenerateAndSharePDF}
              >
                <Share className="mr-2 mt-0.5 h-4 w-4" /> Compartilhar
              </Button>
              <Button
                onClick={handleJoinSession}
                disabled={loading}
                className="bg-black hover:bg-[#3a0ca3] text-white"
              >
                {loading ? (
                  "Entrando"
                ) : (
                  <>
                    Entrar <ArrowRight className="ml-2 mt-0.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
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
