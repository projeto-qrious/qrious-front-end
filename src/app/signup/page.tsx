"use client";

import { useState } from "react";
import { BiLock } from "react-icons/bi";
import CustomInput from "../components/CustomInput ";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Button from "../components/CustomButton";
import SocialButton from "../components/Social";
import Image from "next/image";
import Apple from "@/app/assets/Apple.svg";
import Google from "@/app/assets/Google.svg";
import Facebook from "@/app/assets/Facebook.svg";
import Link from "next/link";

export default function Signup() {
  // Estados para os valores dos inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função para lidar com o submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);

    // Aqui você pode adicionar a lógica de envio (como API ou validação)
  };

  return (
    <div className="p-6 md:p-0 md:flex md:flex-row">
      <section className="md:h-screen md:w-full md:flex md:items-center md:justify-center md:bg-[#0094C611]">
        <h1
          className="text-center font-bold text-4xl pt-4
          md:text-5xl
          lg:text-8xl
      "
        >
          QRious
        </h1>
      </section>
      <section className="md:w-full md:h-screen md:p-24">
        <h2 className="text-start font-bold text-2xl pt-16 pb-8 md:pt-0">
          Criar Conta
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <CustomInput
              label="Nome"
              placeholder="Digite seu nome de usuário"
              leftIcon={<FaUser className="text-gray-500" />}
              containerClassName="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Atualiza o estado do username
            />

            <CustomInput
              label="Email"
              placeholder="Digite seu Email"
              leftIcon={<MdEmail className="text-gray-500" />}
              containerClassName="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email
            />

            <CustomInput
              label="Password"
              placeholder="Digite sua senha"
              leftIcon={<BiLock className="text-gray-500" />}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha
              containerClassName="w-full"
            />
          </div>

          <Button label="Cadastrar" className="my-8" />
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
          />
          <SocialButton
            icon={<Image alt="Apple" src={Apple} width={32} />}
            className="bg-transparent border border-gray-300 p-4 w-24 h-14"
          />
          <SocialButton
            icon={<Image alt="Facebook" src={Facebook} width={32} />}
            className="bg-transparent border border-gray-300 p-4 w-24 h-14"
          />
        </div>

        <div className="flex flex-row gap-2 justify-center items-center">
          <p className="text-base">Já tem uma conta?</p>

          <Link href="/signin">
            <p className="text-base text-[#0094C6] font-bold">Entrar</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
