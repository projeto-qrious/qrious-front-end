"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createSession } from "@/services/sessions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProtectedRoute from "@/hoc/protectedRoutes";
import { QrCode, Plus } from "lucide-react";

interface Session {
  sessionId: string;
  title: string;
  description: string;
  sessionCode: string;
  qrcode: string;
}

function Home() {
  const { role } = useAuth();
  const router = useRouter();
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [newSession, setNewSession] = useState<Session | null>(null);
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
        description: `Falha ao criar a sessão. ${error} Por favor tente novamente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 pt-28 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          QRious Questions
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <QrCode className="w-5 h-5 mr-2 text-[#560bad]" />
                Join a Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/join-session">
                <Button className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white">
                  Enter a Session
                </Button>
              </Link>
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
                      Título
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
                      Descrição
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
                    Create Session
                  </Button>
                </form>
                {newSession && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <p className="text-gray-800 font-semibold">
                      Session "{newSession.title}" created successfully!
                    </p>
                    <Button
                      onClick={() =>
                        router.push(`/sessions/${newSession.sessionId}/details`)
                      }
                      className="mt-2 bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                    >
                      View Session Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
