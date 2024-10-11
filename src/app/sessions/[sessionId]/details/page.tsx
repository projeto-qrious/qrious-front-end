"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSessionDetails } from "@/services/sessions";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/hoc/protectedRoutes";
import GoBack from "@/components/goBack";
import { ArrowLeft } from "lucide-react";

const DetalhesSessao = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
  }, [sessionId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return <div>Sessão não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-28 max-w-4xl">
        <Card className="bg-white shadow-lg p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-8 text-[#560bad]">
              Detalhes da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Seção para QR Code e Código da Sessão */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 border-2 border-gray-300 rounded-lg shadow-lg">
                <img
                  src={session.qrcode}
                  alt="QR Code da Sessão"
                  className="mx-auto w-full h-full"
                />
              </div>
              <p className="text-lg text-gray-800 font-semibold text-center bg-gray-200 p-2 rounded-md shadow-md">
                Código da sessão:{" "}
                <span className="text-2xl text-[#560bad] font-bold">
                  {session.sessionCode}
                </span>
              </p>
            </div>

            {/* Seção para Detalhes da Sessão */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {session.title}
              </h2>
              <p className="text-lg text-gray-600">{session.description}</p>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                onClick={() => {
                  navigator.share
                    ? navigator.share({
                        title: "Entre na minha sessão no QRious",
                        text: `Use o código ${session.sessionCode} ou aponte a câmera para o QR code para entrar na minha sessão no QRious.`,
                        url: window.location.href,
                      })
                    : alert(
                        "Compartilhamento não é suportado nesse navegador."
                      );
                }}
              >
                Compartilhar
              </Button>
              <Button
                className="bg-black hover:bg-gray-600 text-white"
                onClick={() => router.push("/home")}
              >
                <ArrowLeft className="mr-2 mt-0.5 h-4 w-4" />
                Página Inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default function PaginaDetalhesSessao() {
  return (
    <ProtectedRoute>
      <DetalhesSessao />
    </ProtectedRoute>
  );
}
