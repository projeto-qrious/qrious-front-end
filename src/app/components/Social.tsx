import React from "react";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

const SocialButton: React.FC<ButtonProps> = ({
  onClick,
  label,
  className = "",
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full h-12 bg-[#005E7C] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#101c28] hover:border hover:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default SocialButton;
