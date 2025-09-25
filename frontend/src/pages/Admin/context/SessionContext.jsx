import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    

    const refreshSession = async () => {
        try {
        const res = await axios.get("http://localhost:5000/user/api/session", {
            withCredentials: true,
        });
        setUser(res.data.user || null);
        console.log("Session loaded:", res.data.user);
        } catch (err) {
        console.error("No active session:", err);
        setUser(null);
        } finally {
        setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
        await axios.post(
            "http://localhost:5000/user/logout",
            {},
            { withCredentials: true }
        );
        console.log("Logged out successfully");
        } catch (err) {
        console.error("Logout failed:", err);
        }
        setUser(null);
    };

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <SessionContext.Provider
        value={{ user, setUser, login, loading, refreshSession, logout }}
        >
        {children}
        </SessionContext.Provider>
    );
};
