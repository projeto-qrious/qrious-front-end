"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface QuestionsContextProps {
  showQuestions: boolean;
  toggleShowQuestions: () => void;
}

const QuestionsContext = createContext<QuestionsContextProps | undefined>(
  undefined
);

export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const [showQuestions, setShowQuestions] = useState(false);

  const toggleShowQuestions = () => {
    setShowQuestions((prevState) => !prevState);
  };

  return (
    <QuestionsContext.Provider value={{ showQuestions, toggleShowQuestions }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestionsContext = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error(
      "useQuestionsContext must be used within a QuestionsProvider"
    );
  }
  return context;
};
