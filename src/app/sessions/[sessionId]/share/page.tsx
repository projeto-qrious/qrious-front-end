"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSessionDetails } from "@/services/sessions";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/hoc/protectedRoutes";
import GoBack from "@/components/goBack";
import html2pdf from "html2pdf.js";

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

  const sessionDetailsRef = useRef<HTMLDivElement | null>(null);

  const handleGeneratePDF = () => {
    const element = sessionDetailsRef.current;

    if (element) {
      // Remover os botões temporariamente
      const buttons = element.querySelectorAll(
        ".no-print"
      ) as NodeListOf<HTMLElement>;
      buttons.forEach((btn) => (btn.style.display = "none"));

      // Configurações do PDF
      const options = {
        margin: 0.5,
        filename: "Compartilhar Sessão.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      // Gera o PDF
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .finally(() => {
          // Restaurar a exibição dos botões após gerar o PDF
          buttons.forEach((btn) => (btn.style.display = ""));
        });
    } else {
      console.error("Elemento não encontrado para gerar PDF.");
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
  // Dentro do componente SessionDetails
  const sessionURL = `https://qrious-front-end.onrender.com/sessions/joinqrcode/${session.sessionCode}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-28 max-w-4xl">
        <GoBack />
        <Card
          ref={sessionDetailsRef}
          className="bg-white shadow-lg p-8"
          id="session-details"
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-center mb-2 text-[#560bad]">
              {session.title}
            </CardTitle>
            <p className="text-lg text-gray-600">{session.description}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              {session.qrcode ? (
                <div className="p-4 border-2 border-gray-300 rounded-lg shadow-lg">
                  <img
                    src={session.qrcode}
                    alt="QR Code da Sessão"
                    className="mx-auto w-full h-full"
                  />
                </div>
              ) : (
                <p className="text-red-500">QR Code não disponível</p>
              )}

              {/* Link clicável do QR Code */}
              <a
                href={sessionURL}
                className="text-blue-500 underline text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {sessionURL}
              </a>

              <p className="text-lg text-gray-800 font-semibold text-center bg-gray-200 p-2 rounded-md shadow-md flex items-center justify-center">
                Código da sessão:{" "}
                <span className="text-2xl text-[#560bad] font-bold ml-2">
                  {session.sessionCode}
                </span>
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center space-x-4 no-print">
              <a href={sessionURL}>
                <Button className="bg-[#560bad] hover:bg-[#3a0ca3] text-white">
                  Entrar
                </Button>
              </a>
              {/* <Button
                className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Entre na minha sessão no QRious",
                      text: `Use o código ${session.sessionCode} ou aponte a câmera para o QR code para entrar na minha sessão no QRious.`,
                      url: window.location.href,
                    });
                  } else {
                    alert("Compartilhamento não é suportado nesse navegador.");
                  }
                }}
              >
                <Share className="mr-2 mt-0.5 h-4 w-4" /> Compartilhar
              </Button> */}
              <Button
                className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                onClick={handleGeneratePDF}
              >
                Compartilhar
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
