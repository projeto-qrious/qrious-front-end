"use client";

import { useState } from "react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import ProtectedRoute from "../../hoc/protectedRoutes";
import { useAuth } from "../../contexts/AuthContext";
import { createSession } from "../../services/sessions"; // Função para criar sessão

function Home() {
  const { role } = useAuth(); // Recupera o papel do usuário a partir do contexto de autenticação
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Função para lidar com a criação da sessão
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSession = await createSession({
        title: sessionTitle,
        description: sessionDescription,
      });
      setSuccess(`Sessão criada com sucesso! QRCode: ${newSession.qrcode}`);
      setError("");
    } catch (error) {
      setError("Erro ao criar sessão. Tente novamente.");
      setSuccess("");
    }
  };

  return (
    <>
      <Header />
      <section className="pt-28">
        <h1 className="px-6 text-2xl font-semibold pb-4 md:px-10 lg:px-16 xl:px-24">
          Perguntas
        </h1>
        {/* Exibe o botão de criar sessão apenas se o usuário for um SPEAKER */}
        {role === "SPEAKER" && (
          <div className="px-6 md:px-10 lg:px-16 xl:px-24">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Sessão</h2>
            <form onSubmit={handleCreateSession}>
              <div className="mb-4">
                <label className="block mb-2">Título da Sessão</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Descrição da Sessão</label>
                <textarea
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              >
                Criar Sessão
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
          </div>
        )}

        <div className="px-6 grid justify-center items-center md:grid-cols-2 md:gap-4 md:px-10 lg:grid-cols-3 lg:px-16 xl:grid-cols-4 xl:px-24">
          {/* Cards de perguntas (mantidos) */}
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            initialLikes={12}
          />
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            initialLikes={12}
          />
          <Card
            title="Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            initialLikes={12}
          />
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
