import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLogin, registerUser as apiRegister, getProfile } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sakina_token"));
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, fetch user profile
  useEffect(() => {
    if (token) {
      getProfile()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem("sakina_token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const newToken = res.token;
    localStorage.setItem("sakina_token", newToken);
    setToken(newToken);

    // Fetch profile after login
    const profileRes = await getProfile();
    setUser(profileRes.data);

    return res;
  };

  const register = async (name, email, password) => {
    const res = await apiRegister(name, email, password);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("sakina_token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
