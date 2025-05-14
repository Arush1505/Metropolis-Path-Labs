"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Create the context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      try {
        // Get authentication data from sessionStorage
        const authData = sessionStorage.getItem("adminAuth");
        if (authData) {
          const parsedData = JSON.parse(authData);
          setAdmin(parsedData);
        }
      } catch (error) {
        console.error("Session check error:", error);
        // Clear invalid session data
        sessionStorage.removeItem("adminAuth");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = (adminData) => {
    sessionStorage.setItem("adminAuth", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    setAdmin(null);
    router.push("/");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!admin;
  };

  // Context value
  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
