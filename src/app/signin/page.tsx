"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  loginUser,
  signInWithGoogle,
  signInWithFacebook,
} from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FaGoogle as Google, FaFacebook as Facebook } from "react-icons/fa";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [redirectTo, setRedirectTo] = useState("/home"); // Mova o estado para aqui

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setRedirectTo(searchParams.get("redirect") || "/home"); // Atualize o redirecionamento aqui
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password);
      toast({ title: "Sucesso", description: "Login bem-sucedido!" });
      router.push(redirectTo);
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
      toast({
        title: "Erro",
        description: "Falha ao fazer login. Por favor, tente novamente.",
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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-6">
          QRious
        </h1>
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-black">
            <CardTitle className="text-2xl font-semibold text-center">
              Entrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
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
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
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
              <div className="flex items-center justify-end">
                <Link href="/forgot" className="text-sm text-black">
                  Esqueceu sua senha?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ou continue com
                  </span>
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
            </div>
            <p className="mt-6 text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                href="/signup"
                className="font-medium text-[#560bad] hover:text-[#3a0ca3]"
              >
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
