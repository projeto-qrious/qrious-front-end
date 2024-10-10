import Image from "next/image";
import SocialButton from "../components/Social";
import Google from "@/app/assets/Google.svg";
import Apple from "@/app/assets/Apple.svg";
import Mail from "@/app/assets/Mail.svg";

export default function Signup() {
  return (
    <div className="p-6 text-center h-screen lg:flex lg:flex-row lg:items-center lg:p-0">
      <div className="lg:w-full lg:h-screen lg:bg-[#0094C611] h-1/2">
        <h1
          className="text-6xl font-black h-full flex items-center justify-center
        lg:w-full lg:h-full lg:text-8xl
      "
        >
          QRious
        </h1>
      </div>

      <div
        className="lg:w-full lg:p-6 xl:p-24
"
      >
        <h2 className="text-3xl font-bold pb-2 xl:text-4xl">
          Participe da palestra
        </h2>
        <p className="lg:text-xl lg:pt-8">
          Faça parte da conversa, compartilhe suas dúvidas e contribua para um
          diálogo mais enriquecedor.
        </p>

        <div className="pt-8 flex flex-col gap-4 lg:gap-8 lg:items-center lg:pt-14">
          <SocialButton
            label="Continue com Google"
            icon={<Image alt="Google" src={Google} width={32} />}
            className="bg-transparent border border-black text-black font-bold lg:w-[500px]"
          />
          <SocialButton
            label="Continue com Google"
            icon={<Image alt="Google" src={Apple} width={32} />}
            className="bg-transparent border border-black text-black font-bold lg:w-[500px]"
          />
          <SocialButton
            label="Continue com Google"
            icon={<Image alt="Google" src={Mail} width={32} />}
            className="bg-transparent border border-black text-black font-bold lg:w-[500px]"
          />
          <div className="flex flex-row gap-2 justify-center items-center">
            <p className="text-base">Já tem uma conta?</p>

            <p className="text-base text-[#0094C6] font-bold">Entrar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
