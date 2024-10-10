import api from "./api"; // axios com interceptors para enviar o token

export interface CreateSessionData {
  title: string;
  description: string;
}

export async function createSession(data: CreateSessionData) {
  try {
    const response = await api.post("/sessions", data);
    return response.data; // Retorna os dados da sessão, incluindo o QRCode
  } catch (error) {
    throw new Error("Erro ao criar sessão");
  }
}
