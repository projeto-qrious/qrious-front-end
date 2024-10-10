import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CustomInputProps {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // Novo prop para exibir erros
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  labelClassName = "",
  inputClassName = "",
  containerClassName = "",
  leftIcon,
  rightIcon,
  placeholder = "",
  type = "text",
  value,
  onChange,
  error, // Recebe o erro de validação
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // Lida com o toggle da visibilidade da senha
  const handleTogglePassword = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label
          className={`mb-2 text-sm font-bold text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Ícone esquerdo, se existir */}
        {leftIcon && <span className="absolute left-3">{leftIcon}</span>}

        <input
          type={type === "password" && isPasswordVisible ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-md border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-indigo-500"
          } ${leftIcon ? "pl-10" : ""} ${
            rightIcon || type === "password" ? "pr-10" : ""
          } ${inputClassName}`}
        />

        {/* Ícone direito para alternar visibilidade da senha */}
        {type === "password" && (
          <span
            onClick={handleTogglePassword}
            className="absolute right-3 cursor-pointer text-gray-500"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}

        {/* Caso tenha ícone direito fornecido (não para senha) */}
        {rightIcon && type !== "password" && (
          <span className="absolute right-3">{rightIcon}</span>
        )}
      </div>

      {/* Mensagem de erro se existir */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
