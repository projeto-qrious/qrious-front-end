import { FC } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";

const GoBack: FC = () => {
  // const router = useRouter();

  return (
    <Link href="/home">
      <Button
        // onClick={() => router.back()}
        className="bg-transparent hover:bg-[#560bad] text-black hover:text-white  mb-6"
      >
        <ArrowLeft className="mr-2 md:mt-0.5 h-4 w-4" /> Voltar
      </Button>
    </Link>
  );
};

export default GoBack;
