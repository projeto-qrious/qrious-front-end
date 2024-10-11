import { FC } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack: FC = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="bg-transparent hover:bg-[#560bad] text-black hover:text-white  mb-6"
    >
      <ArrowLeft className="mr-2 mt-0.5 h-4 w-4" /> Voltar
    </Button>
  );
};

export default GoBack;
