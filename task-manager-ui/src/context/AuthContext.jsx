import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({
  authToken: null,
  setAuthToken: () => {},
  userRole: null,
  setUserRole: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [authToken]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [userRole]);

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  const value = {
    authToken,
    setAuthToken,
    userRole,
    setUserRole,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
