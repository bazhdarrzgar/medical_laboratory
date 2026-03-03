"use client";

import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthGuard({ children }) {
    const { isLoggedIn, mounted } = useAuth();

    // While checking session storage, render nothing to avoid flash
    if (!mounted) return null;

    if (!isLoggedIn) {
        return <LoginPage />;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="contents"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
