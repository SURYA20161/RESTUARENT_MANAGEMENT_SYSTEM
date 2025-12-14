import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const initialAuthUser = localStorage.getItem("user");
  const [authUser, setAuthUser] = useState(
    initialAuthUser ? JSON.parse(initialAuthUser) : undefined
  );

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setAuthUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setAuthUser(undefined);
        }
      } else {
        setAuthUser(undefined);
      }
    };

    // Check auth status on mount
    checkAuthStatus();

    // Listen for storage changes (for OAuth login updates)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case of programmatic changes
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
