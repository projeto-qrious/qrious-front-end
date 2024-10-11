import axios from "axios";
import api from "./api"; // axios com interceptors para enviar o token

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
