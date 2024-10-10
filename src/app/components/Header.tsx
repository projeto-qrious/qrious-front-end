import { IoMenu } from "react-icons/io5";

const Header: React.FC = () => {
  return (
    <div className="fixed w-full h-20 flex flex-row justify-between px-6 items-center bg-white shadow-md md:px-10 lg:px-16 xl:px-24">
      <IoMenu size={36} />
      <h1 className="text-3xl font-black">QRious</h1>
    </div>
  );
};

export default Header;
