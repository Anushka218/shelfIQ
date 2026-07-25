import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shelfiq_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("shelfiq_token")
  );

  function login(accessToken, userData) {
    console.log("TOKEN RECEIVED:", accessToken);
    console.log("USER RECEIVED:", userData);

    localStorage.setItem("shelfiq_token", accessToken);
    localStorage.setItem(
      "shelfiq_user",
      JSON.stringify(userData)
    );

    setToken(accessToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("shelfiq_token");
    localStorage.removeItem("shelfiq_user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}