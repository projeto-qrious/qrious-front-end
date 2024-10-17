import api from "./api"; // axios com interceptors para enviar o token
import { ref, remove } from "firebase/database";
import { firebaseDatabase } from "@/configs/firebaseconfig";

export interface CreateSessionData {
  title: string;
  description: string;
}

export async function createSession(data: CreateSessionData) {
  try {
    const response = await api.post(`/sessions`, data);
    return response.data; // Retorna os dados da sessão, incluindo o QRCode
  } catch (error) {
    throw new Error(`Erro ao criar sessão: ${error}`);
  }
}

export async function joinSession(
  sessionId: string | null,
  sessionCode: string | null
): Promise<{ sessionId: string }> {
  try {
    const response = await api.post("/sessions/join", {
      sessionId,
      sessionCode,
    });
    return response.data; // Retorna o sessionId do backend para ser usado no redirecionamento
  } catch (error) {
    console.error("Erro ao entrar na sessão:", error);
    throw error;
  }
}

export async function fetchUserSessions(userId: string) {
  try {
    const response = await api.get(`/sessions/user/${userId}`);
    return response.data; // Retorna as sessões do usuário
  } catch (error) {
    console.error("Erro ao carregar as sessões do usuário:", error);
    throw error;
  }
}

export async function fetchSessionsBySpeaker() {
  try {
    const response = await api.get(`/sessions/speaker/createdSessions`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar as sessões do usuário:", error);
    throw error;
  }
}

export async function fetchSession(sessionId: string) {
  try {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar a sessão:", error);
    throw error;
  }
}

export async function getSessionDetails(sessionId: string) {
  try {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session details:", error);
    throw error;
  }
}

export async function createQuestion(sessionId: string, text: string) {
  try {
    const response = await api.post(`/sessions/questions`, { sessionId, text });
    return response.data;
  } catch (error) {
    console.error("Error creating a question:", error);
    throw error;
  }
}

export async function fetchQuestionDetails(
  sessionId: string,
  questionId: string
) {
  try {
    const response = await api.get(
      `/sessions/${sessionId}/questions/${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os detalhes da pergunta:", error);
    throw error;
  }
}

export async function voteQuestion(sessionId: string, questionId: string) {
  try {
    const response = await api.post(
      `/sessions/${sessionId}/questions/${questionId}/vote`
    );
    return response.data;
  } catch (error) {
    console.error("Error creating a question:", error);
    throw error;
  }
}

export const deleteQuestion = async (sessionId: string, questionId: string) => {
  const questionRef = ref(
    firebaseDatabase,
    `sessions/${sessionId}/questions/${questionId}`
  );
  await remove(questionRef);
};
