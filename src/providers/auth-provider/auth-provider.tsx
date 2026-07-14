import { useEffect, useState, type ReactNode } from "react";
import {
  createSession,
  createUser,
  deleteSession,
  getCurrentUser,
} from "../../services";
import type { Status, User } from "../../types";
import { AuthContext } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    async function runEffect() {
      try {
        setUser(await getCurrentUser());
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }

    runEffect();
  }, []);

  async function login(email: string, password: string) {
    setUser(await createSession(email, password));
  }

  async function signup(email: string, password: string) {
    setUser(await createUser(email, password));
  }

  async function logout() {
    await deleteSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
