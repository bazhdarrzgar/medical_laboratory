"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-card text-card-foreground w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border"
                >
                    {/* Header */}
                    <div className="bg-brand dark:bg-brand/90 text-white p-4 flex items-center justify-between">
                        <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] tajawal">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 px-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
