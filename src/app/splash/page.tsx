import Link from "next/link";
import Button from "../components/CustomButton";

export default function Splash() {
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
          <Link href="/signup">
            <Button
              label="Entrar"
              className="font-bold lg:text-lg lg:w-[500px]"
            />
          </Link>
          <Button
            label="Criar Conta"
            className="bg-white border border-black text-black font-bold lg:text-lg lg:w-[500px]"
          />
        </div>
      </div>
    </div>
  );
}
