"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";
import { Sun, Moon, Languages, Monitor, Check, ChevronDown, Type, Plus, Minus, RefreshCcw, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFontSize } from "@/context/FontSizeContext";

const navItems = [
    { name: "home", href: "/" },
    { name: "patientsList", href: "/patients" },
    { name: "categoryList", href: "/categories" },
    { name: "doctorsList", href: "/doctors" },
    { name: "samples", href: "/samples" },
    { name: "previousVisit", href: "/previous-visit" },
    { name: "testRecord", href: "/test-record" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { t, lang, changeLanguage } = useLanguage();
    const { logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();
    const [themeOpen, setThemeOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [fontOpen, setFontOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const themeRef = useRef(null);
    const langRef = useRef(null);
    const fontRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeRef.current && !themeRef.current.contains(event.target)) {
                setThemeOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangOpen(false);
            }
            if (fontRef.current && !fontRef.current.contains(event.target)) {
                setFontOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const themes = [
        { id: "light", name: "light", icon: Sun, color: "text-amber-500" },
        { id: "dark", name: "dark", icon: Moon, color: "text-indigo-400" },
        { id: "system", name: "system", icon: Monitor, color: "text-slate-400" },
    ];

    const languages = [
        { id: "en", name: "english", label: "EN" },
        { id: "ku", name: "kurdish", label: "KU" },
        { id: "ar", name: "arabic", label: "AR" },
    ];

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", duration: 0.3, bounce: 0.3 }
        },
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <nav className="w-full bg-brand dark:bg-[#0c4a6e] text-white overflow-visible shadow-xl border-b border-white/5 relative z-50 transition-colors duration-500">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Desktop Navigation */}
                <div className="hidden xl:flex h-full overflow-x-auto no-scrollbar scroll-smooth flex-1">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center px-6 h-full text-intermediate font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap group ${isActive
                                    ? "text-brand"
                                    : "text-white/80 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbarActiveTab"
                                        className="absolute inset-0 bg-background"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                        style={{ zIndex: 0 }}
                                    />
                                )}
                                <span className="relative z-10 tajawal">{t(item.name)}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Navigation Toggle */}
                <div className="flex xl:hidden flex-1 items-center relative" ref={menuRef}>
                    <button
                        onClick={() => {
                            setMenuOpen(!menuOpen);
                            setThemeOpen(false);
                            setLangOpen(false);
                            setFontOpen(false);
                        }}
                        className={`flex items-center gap-2 px-4 h-10 rounded-xl transition-all border border-white/10 active:scale-95 ${menuOpen ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
                            }`}
                    >
                        <Menu size={20} />
                        <span className="font-bold tajawal uppercase tracking-wider text-sm">{t("menu")}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden py-2 z-[60]"
                            >
                                {navItems.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/" && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${isActive
                                                ? "bg-brand/10 text-brand border-l-4 border-brand"
                                                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <span className="tajawal">{t(item.name)}</span>
                                            {isActive && <Check size={14} className="ml-auto" />}
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 md:gap-4 pl-4 border-l border-white/10 ml-4 h-8 shrink-0">
                    {/* Theme Dropdown */}
                    <div className="relative" ref={themeRef}>
                        <button
                            onClick={() => {
                                setThemeOpen(!themeOpen);
                                setLangOpen(false);
                                setFontOpen(false);
                            }}
                            className={`p-2 rounded-xl transition-all border border-white/5 active:scale-95 flex items-center gap-1 ${themeOpen ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
                                }`}
                            title={t("theme")}
                        >
                            {!mounted ? (
                                <Monitor size={18} className="text-slate-300" />
                            ) : theme === "dark" ? (
                                <Moon size={18} className="text-indigo-300" />
                            ) : theme === "light" ? (
                                <Sun size={18} className="text-amber-300" />
                            ) : (
                                <Monitor size={18} className="text-slate-300" />
                            )}
                            <ChevronDown size={14} className={`transition-transform duration-300 ${themeOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {themeOpen && (
                                <motion.div
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden py-1.5 z-[60]"
                                >
                                    {themes.map((tItem) => (
                                        <button
                                            key={tItem.id}
                                            onClick={() => {
                                                setTheme(tItem.id);
                                                setThemeOpen(false);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <tItem.icon size={16} className={tItem.color} />
                                                <span className="font-medium">{t(tItem.name)}</span>
                                            </div>
                                            {mounted && theme === tItem.id && <Check size={14} className="text-brand" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Font Size Dropdown */}
                    <div className="relative" ref={fontRef}>
                        <button
                            onClick={() => {
                                setFontOpen(!fontOpen);
                                setThemeOpen(false);
                                setLangOpen(false);
                            }}
                            className={`p-2 rounded-xl transition-all border border-white/5 active:scale-95 flex items-center gap-1 ${fontOpen ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
                                }`}
                            title={t("fontSize")}
                        >
                            <Type size={18} className="text-emerald-300" />
                            <ChevronDown size={14} className={`transition-transform duration-300 ${fontOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {fontOpen && (
                                <motion.div
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden py-1.5 z-[60]"
                                >
                                    <div className="px-4 py-2 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t("fontSize")}</span>
                                        <span className="text-xs font-mono text-brand font-bold">{fontSize}px</span>
                                    </div>

                                    <div className="p-2 flex flex-col gap-1">
                                        <button
                                            onClick={increaseFontSize}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <Plus size={16} className="text-green-500" />
                                            <span>{t("increase")}</span>
                                        </button>
                                        <button
                                            onClick={decreaseFontSize}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <Minus size={16} className="text-rose-500" />
                                            <span>{t("decrease")}</span>
                                        </button>
                                        <button
                                            onClick={resetFontSize}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                                        >
                                            <RefreshCcw size={16} className="text-sky-500" />
                                            <span>{t("reset")}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Language Dropdown */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => {
                                setLangOpen(!langOpen);
                                setThemeOpen(false);
                                setFontOpen(false);
                            }}
                            className={`p-2 px-3 rounded-xl transition-all border border-white/5 flex items-center gap-2 text-xs uppercase font-extrabold active:scale-95 ${langOpen ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            <Languages size={18} />
                            <span className="hidden sm:inline">{lang}</span>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden py-1.5 z-[60]"
                                >
                                    {languages.map((lItem) => (
                                        <button
                                            key={lItem.id}
                                            onClick={() => {
                                                changeLanguage(lItem.id);
                                                setLangOpen(false);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-smaller font-bold ${lang === lItem.id ? "bg-brand text-white" : "bg-neutral-200 dark:bg-white/10"
                                                    }`}>
                                                    {lItem.label}
                                                </div>
                                                <span className="font-medium">{t(lItem.name)}</span>
                                            </div>
                                            {mounted && lang === lItem.id && <Check size={14} className="text-brand" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                    {/* Logout Button */}
                    <button
                        id="navbar-logout"
                        onClick={logout}
                        title="Logout"
                        className="p-2 rounded-xl transition-all border border-white/5 active:scale-95 flex items-center gap-1.5 bg-white/10 hover:bg-red-500/30 hover:border-red-400/30 group"
                    >
                        <LogOut size={18} className="text-white/70 group-hover:text-red-300 transition-colors duration-200" />
                    </button>

                </div>
            </div>
        </nav>
    );
}

