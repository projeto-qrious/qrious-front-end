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
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    // O estado de autenticação será atualizado pelo AuthContext
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
}

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    console.log("Google ID Token:", token);
    alert("Login com Google bem-sucedido! Token JWT obtido: " + token);
  } catch (error: any) {
    console.error("Erro no login com Google: " + error.message);
  }
}
