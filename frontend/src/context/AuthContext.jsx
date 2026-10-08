import { createContext, useContext, useMemo, useState } from "react";
import { login as loginApi, register as registerApi } from "../services/authService";

const AuthContext = createContext(null);

function readUser() {
  try { return JSON.parse(localStorage.getItem("jobnest_user") || "null"); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const saveSession = (data) => {
    localStorage.setItem("jobnest_token", data.token);
    localStorage.setItem("jobnest_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await loginApi(payload);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await registerApi(payload);
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("jobnest_token");
    localStorage.removeItem("jobnest_user");
    setUser(null);
  };

  const value = useMemo(() => ({
    user, isAuthenticated: !!user, isAdmin: user?.role === "ADMIN", login, register, logout
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
