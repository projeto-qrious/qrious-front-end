"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { joinSession } from "@/services/sessions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { WithAuth } from "@/hoc/withAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

function JoinQrCode() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Iniciando...");

  const sessionCode: string = Array.isArray(params?.sessionCode)
    ? params.sessionCode[0]
    : params?.sessionCode;

  useEffect(() => {
    const handleJoinSession = async () => {
      if (!loading && user && sessionCode) {
        try {
          setStatus("Verificando código da sessão...");
          setProgress(25);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setStatus("Conectando à sessão...");
          setProgress(50);
          const { sessionId: returnedSessionId } = await joinSession(
            null,
            sessionCode
          );

          setStatus("Configurando sua participação...");
          setProgress(75);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setStatus("Entrando na sessão...");
          setProgress(100);
          await new Promise((resolve) => setTimeout(resolve, 500));

          toast({ title: "Sucesso", description: "Você entrou na sessão!" });
          router.push(`/sessions/${returnedSessionId}`);
        } catch (error) {
          console.error("Erro ao entrar na sessão:", error);
          toast({
            title: "Erro",
            description: "Não foi possível entrar na sessão. Tente novamente.",
            variant: "destructive",
          });
          setStatus("Falha ao entrar na sessão");
        }
      }
    };

    if (!loading && sessionCode) {
      handleJoinSession();
    } else if (!sessionCode) {
      toast({
        title: "Erro",
        description: "Código da sessão não encontrado.",
        variant: "destructive",
      });
      setStatus("Código da sessão não encontrado");
    }
  }, [user, loading, sessionCode, router, toast]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#560bad]">
            Entrando na Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#560bad]" />
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-gray-600">{status}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WithAuth(JoinQrCode);
