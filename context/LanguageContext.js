"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState("ku"); // Default to Kurdish
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem("lang");
        if (savedLang) {
            setLang(savedLang);
        }
    }, []);

    const changeLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem("lang", newLang);
    };

    const t = (key) => {
        return translations[lang][key] || key;
    };

    const dir = lang === "en" ? "ltr" : "rtl";

    return (
        <LanguageContext.Provider value={{ lang, changeLanguage, t, dir }}>
            <div dir={mounted ? dir : "rtl"} lang={mounted ? lang : "ku"}>{children}</div>
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
