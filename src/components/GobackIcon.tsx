import { IoIosArrowBack } from "react-icons/io";

const Goback: React.FC = () => {
  return (
    <div className="p-2 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
      <IoIosArrowBack className="text-2xl text-gray-700" width={24} />
    </div>
  );
};

export default Goback;
