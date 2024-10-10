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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Adicione o onBlur
  error?: string;
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
  onBlur, // Receber o onBlur como prop
  error,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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
        {leftIcon && <span className="absolute left-3">{leftIcon}</span>}

        {/* Passar `value`, `onChange`, e `onBlur` diretamente */}
        <input
          type={type === "password" && isPasswordVisible ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // Adicione onBlur para garantir que o hook capture o evento de blur
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-md border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-indigo-500"
          } ${leftIcon ? "pl-10" : ""} ${
            rightIcon || type === "password" ? "pr-10" : ""
          } ${inputClassName}`}
        />

        {type === "password" && (
          <span
            onClick={handleTogglePassword}
            className="absolute right-3 cursor-pointer text-gray-500"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}

        {rightIcon && type !== "password" && (
          <span className="absolute right-3">{rightIcon}</span>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
