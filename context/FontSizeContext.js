"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const FontSizeContext = createContext();

export function FontSizeProvider({ children }) {
    const [fontScale, setFontScale] = useState(1); // Default scale 1
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedScale = localStorage.getItem("fontScale");
        if (savedScale) {
            setFontScale(parseFloat(savedScale));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.style.setProperty("--font-scale", fontScale.toString());
            localStorage.setItem("fontScale", fontScale.toString());
        }
    }, [fontScale, mounted]);

    const increaseFontSize = () => setFontScale(prev => Math.min(prev + 0.1, 1.5));
    const decreaseFontSize = () => setFontScale(prev => Math.max(prev - 0.1, 0.8));
    const resetFontSize = () => setFontScale(1);

    const fontSize = Math.round(fontScale * 16); // For display purposes

    return (
        <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
}

export const useFontSize = () => useContext(FontSizeContext);
