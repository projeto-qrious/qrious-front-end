"use client";

import { useState } from "react";
import CustomInput from "../components/CustomInput";
import { MdEmail } from "react-icons/md";
import Button from "../components/CustomButton";

export default function Forgout() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
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
        <h2 className="text-start font-bold text-2xl pt-16 pb-2 md:pt-0">
          Esqueceu a senha? 🤔
        </h2>
        <p className="pb-8 text-gray-500">
          Não se preocupe! Acontece. Por favor insira o email associado a sua
          conta.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <CustomInput
              label="Email"
              placeholder="Digite seu Email"
              leftIcon={<MdEmail className="text-gray-500" />}
              containerClassName="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button label="Entrar" className="my-8" />
        </form>
      </section>
    </div>
  );
}
