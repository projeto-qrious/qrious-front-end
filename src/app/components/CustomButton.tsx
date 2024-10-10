import React from "react";

interface ButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full h-12 bg-[#005E7C] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#101c28] hover:border hover:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
