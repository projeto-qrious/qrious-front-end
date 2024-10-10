"use client";

import { useEffect, useState } from "react";
import { BiLock } from "react-icons/bi";
import CustomInput from "../../components/CustomInput";
import { MdEmail } from "react-icons/md";
import Button from "../../components/CustomButton";
import SocialButton from "../../components/Social";
import Image from "next/image";
import Google from "../../assets/Google.svg";
import Facebook from "../../assets/Facebook.svg";
import Link from "next/link";

import {
  loginUser,
  signInWithFacebook,
  signInWithGoogle,
} from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await loginUser(email, password);
      router.push("/home");
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [user, loading]);

  return (
    <div className="p-6 md:p-0 md:flex md:flex-row">
      <section className="md:h-screen md:w-full md:flex md:items-center md:justify-center md:bg-[#0094C611]">
        <h1 className="text-center font-bold text-4xl pt-4 md:text-5xl lg:text-8xl">
          QRious
        </h1>
      </section>
      <section className="md:w-full md:h-screen md:p-24">
        <h2 className="text-start font-bold text-2xl pt-16 pb-8 md:pt-0">
          Olá, Bem vindo! 👋
        </h2>

        {/* Formulário de login */}
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {/* Campo de e-mail */}
            <CustomInput
              label="Email"
              placeholder="Digite seu Email"
              leftIcon={<MdEmail className="text-gray-500" />}
              containerClassName="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Campo de senha */}
            <CustomInput
              label="Password"
              placeholder="Digite sua senha"
              leftIcon={<BiLock className="text-gray-500" />}
              type="password"
              containerClassName="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Link href="/forgout">
              <p className="text-end text-gray-500">Esqueceu a senha?</p>
            </Link>
          </div>

          <Button label="Entrar" type="submit" className="my-8" />
        </form>

        <div className="flex flex-row gap-1 items-baseline">
          <div className="relative w-full">
            <div className="border-t border-gray-300 w-full mb-1"></div>
          </div>

          <p className="font-normal text-base text-center text-gray-700 pb-4 text-nowrap">
            Ou entrar com
          </p>
          <div className="relative w-full">
            <div className="border-t border-gray-300 w-full mb-1"></div>
          </div>
        </div>
        <div className="flex flex-row justify-around pb-6 gap-2">
          <SocialButton
            icon={<Image alt="Google" src={Google} width={32} />}
            className="bg-transparent border border-gray-300 p-4 w-24 h-14"
            onClick={signInWithGoogle}
          />
          <SocialButton
            icon={<Image alt="Facebook" src={Facebook} width={32} />}
            className="bg-transparent border border-gray-300 p-4 w-24 h-14"
            onClick={signInWithFacebook}
          />
        </div>

        <div className="flex flex-row gap-2 justify-center items-center">
          <p className="text-base">Não tem uma conta?</p>
          <Link href="/signup">
            <p className="text-base text-[#0094C6] font-bold">Cadastrar</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
