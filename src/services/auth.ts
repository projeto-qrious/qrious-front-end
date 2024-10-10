import { auth } from "../configs/firebaseconfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

    // Remove o campo `phoneNumber` se não for fornecido
    if (!phoneNumber) {
      delete payload.phoneNumber;
    }

    const response = await api.post(`/auth/register`, payload);

    return response.data;
  } catch (error) {
    console.error("Erro ao registrar o usuário. ", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const idToken = await user.getIdToken();
    localStorage.setItem("token", idToken);

    const response = await api.post(`/auth/verify-token`, {
      idToken,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login. ", error);
    throw error;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    console.log("Google ID Token:", token);
    alert("Login com Google bem-sucedido! Token JWT obtido: " + token);
  } catch (error: any) {
    console.error("Erro no login com Google: " + error.message);
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
