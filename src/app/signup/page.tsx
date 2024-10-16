"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser, loginUser } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation"; // Importando useSearchParams

// Adicionando tipagem explícita ao parâmetro redirectTo
function SignUpForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo); // Redireciona para a página original
    }
  }, [user, loading, router, redirectTo]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(email, password, username);
      await loginUser(email, password); // Considere mover isso para o backend para otimização
      toast({ title: "Sucesso", description: "Conta criada com sucesso!" });
      router.push(redirectTo);
    } catch (error) {
      console.error("Erro ao registrar: ", error);
      toast({
        title: "Erro",
        description: "Falha ao criar a conta. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Nome de usuário
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
            placeholder="Digite seu nome de usuário"
            required
            disabled={isLoading} // Desabilita o campo durante o carregamento
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
            placeholder="Digite seu email"
            required
            disabled={isLoading} // Desabilita o campo durante o carregamento
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Senha
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
            placeholder="Digite sua senha"
            required
            disabled={isLoading} // Desabilita o campo durante o carregamento
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
              disabled={isLoading} // Desabilita o botão durante o carregamento
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
        disabled={isLoading} // Desabilita o botão durante o carregamento
      >
        {isLoading ? "Criando Conta..." : "Criar Conta"}
      </Button>
    </form>
  );
}

// Componente que envolve a chamada de useSearchParams em Suspense
function SignUpWithSearchParams() {
  const searchParams = useSearchParams(); // Obtendo os parâmetros da URL
  const redirectTo = searchParams.get("redirect") || "/home"; // Acessando o parâmetro redirect

  return <SignUpForm redirectTo={redirectTo} />;
}

export default function SignUp() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-4xl font-bold text-gray-900 mb-6">
            QRious
          </h1>
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-black">
              <CardTitle className="text-2xl font-semibold text-center">
                Criar Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpWithSearchParams />
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
