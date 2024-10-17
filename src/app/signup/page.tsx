"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser, loginUser } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation"; // Importando useSearchParams
// import { Separator } from "@/components/ui/separator";
// import { FaGoogle as Google, FaFacebook as Facebook } from "react-icons/fa";

function SignUpForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");
    const internationalPhoneNumber = `+55${formattedPhoneNumber}`;

    try {
      await registerUser(email, password, username, internationalPhoneNumber);
      await loginUser(email, password);
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

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 2) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7,
        11
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Número de Celular
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="phoneNumber"
            type="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="pl-10 border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
            placeholder="Digite seu email"
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
              disabled={isLoading}
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
        disabled={isLoading}
      >
        {isLoading ? "Criando Conta..." : "Criar Conta"}
      </Button>
      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continue com</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={signInWithGoogle}
            className="border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            <Google className="h-5 w-5 mr-2 text-[#560bad]" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={signInWithFacebook}
            className="border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            <Facebook className="h-5 w-5 mr-2 text-[#3a0ca3]" />
            Facebook
          </Button>
        </div>
      </div> */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Já tem uma conta?{" "}
        <a
          href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-medium text-[#560bad] hover:text-[#3a0ca3]"
        >
          Entrar
        </a>
      </p>
    </form>
  );
}

function SignUpWithSearchParams() {
  const searchParams = useSearchParams(); // Obtendo os parâmetros da URL
  const redirectTo = searchParams.get("redirect") || "/home";

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
