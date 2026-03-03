"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Microscope, User, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simulate a small delay for UX
        await new Promise((r) => setTimeout(r, 700));

        const success = login(username, password);
        setLoading(false);

        if (!success) {
            setError("Invalid username or password. Please try again.");
            setShake(true);
            setTimeout(() => setShake(false), 600);
            setPassword("");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c1a2e] via-[#0a3047] to-[#0c4a6e] z-[999]">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
                className={`relative z-10 w-full max-w-md mx-4 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                style={shake ? { animation: "shake 0.4s ease-in-out" } : {}}
            >
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Header */}
                    <div className="relative px-8 pt-10 pb-8 text-center">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", bounce: 0.5, duration: 0.8 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_8px_32px_rgba(14,165,233,0.4)] mb-5"
                        >
                            <Microscope size={38} className="text-white" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="text-3xl font-black text-white tracking-tight"
                        >
                            تاقیگەی میران
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="text-sky-300/80 text-sm font-semibold uppercase tracking-[0.3em] mt-1"
                        >
                            Meran Medical Laboratory
                        </motion.p>

                        {/* Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.55, duration: 0.5 }}
                            className="mt-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-10">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-white/50 text-xs uppercase tracking-[0.2em] font-bold text-center mb-6"
                        >
                            Sign in to continue
                        </motion.p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.65 }}
                            >
                                <label className="block text-xs font-bold text-sky-300/70 uppercase tracking-[0.15em] mb-2">
                                    Username
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={17} className="text-white/30 group-focus-within:text-sky-400 transition-colors duration-200" />
                                    </div>
                                    <input
                                        id="login-username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Enter username…"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm font-medium focus:outline-none focus:border-sky-500/60 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                                    />
                                </div>
                            </motion.div>

                            {/* Password field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.75 }}
                            >
                                <label className="block text-xs font-bold text-sky-300/70 uppercase tracking-[0.15em] mb-2">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={17} className="text-white/30 group-focus-within:text-sky-400 transition-colors duration-200" />
                                    </div>
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Enter password…"
                                        className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm font-medium focus:outline-none focus:border-sky-500/60 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/70 transition-colors duration-200"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Error message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        exit={{ opacity: 0, y: -8, height: 0 }}
                                        className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    >
                                        <AlertCircle size={16} className="text-red-400 shrink-0" />
                                        <p className="text-red-300 text-xs font-semibold">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.85 }}
                                className="pt-2"
                            >
                                <button
                                    id="login-submit"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-[0_8px_24px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.45)] transition-all duration-300 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            <span>Signing in…</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={18} />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 pointer-events-none rounded-xl" />
                                </button>
                            </motion.div>
                        </form>

                        {/* Footer */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-center text-white/20 text-xs font-medium mt-8 uppercase tracking-[0.2em]"
                        >
                            Laboratory Management System · v1.0
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    15%       { transform: translateX(-8px); }
                    30%       { transform: translateX(8px); }
                    45%       { transform: translateX(-6px); }
                    60%       { transform: translateX(6px); }
                    75%       { transform: translateX(-3px); }
                    90%       { transform: translateX(3px); }
                }
            `}</style>
        </div>
    );
}
