"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../configs/firebaseconfig";
import { User, onIdTokenChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  token: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  token: null,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);

        const db = getDatabase();
        const roleSnapshot = await get(
          ref(db, `users/${firebaseUser.uid}/role`)
        );
        const role = roleSnapshot.val();

        // You can store the role in the context
        setRole(role);
      } else {
        setUser(null);
        setToken(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
