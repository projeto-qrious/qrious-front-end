"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createSession,
  fetchSessionsBySpeaker,
  fetchUserSessions,
} from "@/services/sessions"; // Função que busca as sessões do usuário
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProtectedRoute from "@/hoc/protectedRoutes";
import { QrCode, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface Session {
  sessionId: string;
  title: string;
  description: string;
}

function Home() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [newSession, setNewSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [createdSessions, setCreatedSessions] = useState<Session[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [speakerLoading, setSpeakerLoading] = useState(true);
  const { toast } = useToast();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await createSession({
        title: sessionTitle,
        description: sessionDescription,
      });
      setNewSession(session);
      setSessionTitle("");
      setSessionDescription("");
      toast({
        title: "Sessão criada com sucesso",
        description: `A sessão "${session.title}" foi criada.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Falha ao criar a sessão. ${error} Por favor, tente novamente.`,
        variant: "destructive",
      });
    }
  };

  // Função para buscar as sessões que o usuário já entrou e já criou
  useEffect(() => {
    const loadUserSessions = async () => {
      setUserLoading(true);
      try {
        if (user?.uid) {
          const userSessions = await fetchUserSessions(user.uid);
          setSessions(userSessions);

          // Se o usuário for SPEAKER, também buscar as sessões que ele criou
          if (role === "SPEAKER") {
            const createdSessions = await fetchSessionsBySpeaker();
            setCreatedSessions(createdSessions);
          }
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: `Falha ao carregar as sessões. ${error}`,
          variant: "destructive",
        });
      } finally {
        setUserLoading(false);
      }
    };

    const loadSpeakerSessions = async () => {
      if (role === "SPEAKER") {
        setSpeakerLoading(true);
        try {
          const createdSessions = await fetchSessionsBySpeaker();
          setCreatedSessions(createdSessions);
        } catch (error) {
          toast({
            title: "Erro",
            description: `Falha ao carregar as sessões criadas. ${error}`,
            variant: "destructive",
          });
        } finally {
          setSpeakerLoading(false);
        }
      }
    };

    loadUserSessions();
    loadSpeakerSessions();
  }, [user?.uid, role, toast]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 pt-28 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <QrCode className="w-5 h-5 mr-2 text-[#560bad]" />
                Entrar em uma Sessão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/join-session")}
                className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
              >
                Entrar na Sessão
              </Button>
            </CardContent>
          </Card>

          {role === "SPEAKER" && (
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Plus className="w-5 h-5 mr-2 text-[#560bad]" />
                  Criar nova sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSession} className="space-y-4">
                  <div>
                    <label
                      htmlFor="sessionTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Título da Sessão
                    </label>
                    <Input
                      id="sessionTitle"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sessionDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Descrição da Sessão
                    </label>
                    <Textarea
                      id="sessionDescription"
                      value={sessionDescription}
                      onChange={(e) => setSessionDescription(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                  >
                    Criar Sessão
                  </Button>
                </form>
                {newSession && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <p className="text-gray-800 font-semibold">
                      Sessão {newSession.title} criada com sucesso!
                    </p>
                    <Button
                      onClick={() =>
                        router.push(`/sessions/${newSession.sessionId}/share`)
                      }
                      className="mt-2 bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                    >
                      Ver Detalhes da Sessão
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {role === "SPEAKER" && (
          <div className="mt-12 mb-6">
            <h2 className="text-2xl font-bold mb-4">Sessões criadas</h2>
            <div className="grid gap-3">
              {speakerLoading ? (
                // Skeleton loader enquanto as sessões são carregadas
                Array.from({ length: 4 }).map((_, index) => (
                  <Card
                    key={index}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-10 w-1/3 mt-4" />
                    </CardContent>
                  </Card>
                ))
              ) : createdSessions.length > 0 ? (
                createdSessions.map((session) => (
                  <Card
                    key={session.sessionId}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 h-[3em] line-clamp-2 overflow-hidden text-ellipsis mb-1">
                        {session.description}
                      </p>
                      <Button
                        onClick={() =>
                          router.push(`/sessions/${session.sessionId}/share`)
                        }
                        className="mt-2 bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                      >
                        Ver detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600">
                  Você ainda não criou nenhuma sessão.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Seção para exibir as sessões que o usuário já entrou */}
        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Sessões que você participa
          </h2>
          <div className="grid gap-3">
            {userLoading ? (
              // Skeleton loader enquanto as sessões são carregadas
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-10 w-1/3 mt-4" />
                  </CardContent>
                </Card>
              ))
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <Card
                  key={session.sessionId}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 h-[3em] line-clamp-2 overflow-hidden text-ellipsis mb-1">
                      {session.description}
                    </p>
                    <Button
                      onClick={() =>
                        router.push(`/sessions/${session.sessionId}`)
                      }
                      className="mt-2 bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                    >
                      Entrar
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-600">
                Você ainda não entrou em nenhuma sessão.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
