import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/session", {
        withCredentials: true,
      });
      setUser(res.data.user || null);
    } catch (err) {
      console.error("❌ No active session:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
    setUser(null); // ✅ This triggers WhiskerMeter reset
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ user, setUser, loading, refreshSession, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
};
