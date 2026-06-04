import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../api/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // on app load, check if there's a saved token and restore the session
  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = (user) => setCurrentUser(user);

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
