"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Hardcoded credentials (client-side only — suitable for a local LMS)
const VALID_USERNAME = "meran";
const VALID_PASSWORD = "meran123";
const SESSION_KEY = "lms_auth";

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const session = sessionStorage.getItem(SESSION_KEY);
        if (session === "true") {
            setIsLoggedIn(true);
        }
    }, []);

    const login = (username, password) => {
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            setIsLoggedIn(true);
            sessionStorage.setItem(SESSION_KEY, "true");
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, mounted }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
