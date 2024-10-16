import { auth } from "../configs/firebaseconfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";

import api from "./api";

export async function registerUser(
  email: string,
  password: string,
  displayName = "",
  phoneNumber?: string
) {
  try {
    const payload = { email, password, displayName, phoneNumber };

    if (!phoneNumber) {
      delete payload.phoneNumber;
    }

    await api.post("/auth/register", payload);
    await loginUser(email, password);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao registrar o usuário:", error.message);
      throw error;
    }
    console.error("Erro desconhecido ao registrar o usuário:", error);
    throw new Error("Erro desconhecido ao registrar o usuário.");
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao fazer login:", error.message);
      throw error;
    }
    console.error("Erro desconhecido ao fazer login:", error);
    throw new Error("Erro desconhecido ao fazer login.");
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    // O estado de autenticação será atualizado pelo AuthContext
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro no login com Google:", error.message);
      throw error;
    }
    console.error("Erro desconhecido no login com Google:", error);
    throw new Error("Erro desconhecido no login com Google.");
  }
}

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    console.log("Google ID Token:", token);
    alert("Login com Google bem-sucedido! Token JWT obtido: " + token);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro no login com Google:", error.message);
    } else {
      console.error("Erro desconhecido no login com Google:", error);
    }
  }
}
