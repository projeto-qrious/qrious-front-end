"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../configs/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getDatabase, ref, get } from "firebase/database";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("token", token);

        // Fetch user role from Realtime Database
        const db = getDatabase();
        const roleSnapshot = await get(
          ref(db, `users/${firebaseUser.uid}/role`)
        );
        const role = roleSnapshot.val();

        // You can store the role in the context
        setRole(role);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem("token");
    router.push("/signin"); // Redirect to signin page after logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
