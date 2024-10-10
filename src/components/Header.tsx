import React, { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { motion } from "framer-motion";
import { MdLogout } from "react-icons/md";
import { FaBook, FaHeart } from "react-icons/fa";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed w-full h-20 flex flex-row justify-between px-6 items-center bg-white shadow-md md:px-10 lg:px-16 xl:px-24">
      <IoMenu size={36} onClick={toggleMenu} className="cursor-pointer" />
      <h1 className="text-3xl font-black">QRious</h1>

      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 h-full w-64 lg:w-96 bg-white text-white shadow-2xl z-50"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            type: "tween",
            duration: 0.3,
            ease: [0.6, 0.05, 0.2, 0.95],
          }}
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold mb-2 text-[#000]">Olá, Rodolfo</h2>
          </div>
          <ul className="mt-12">
            <li className="py-6 mt-12 pl-6 mr-6 rounded-md  hover:bg-gray-700 transition-colors cursor-pointer text-[#000] font-semibold text-xl shadow-md flex flex-row items-center gap-2">
              <FaBook /> Minhas Perguntas
            </li>
            <li className="py-6 mt-12  pl-6 mr-6 rounded-md hover:bg-gray-700 transition-colors cursor-pointer text-[#000] font-semibold text-xl shadow-md flex flex-row items-center gap-2">
              <FaHeart /> Meus Votos
            </li>
          </ul>
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-4 text-[#000]"
          >
            <IoClose size={24} />
          </button>
          <div className="absolute bottom-4 left-0 w-full p-4">
            <button className="w-ful text-red-700 py-2 rounded-lg transition-colors">
              <MdLogout size={32} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Header;
