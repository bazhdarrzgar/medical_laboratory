"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Table from "@/components/Table";
import { Search, FilterX, Calendar, Clock, User, Beaker, UserSquare, Phone, Activity, FileText, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreviousVisitPage() {
    const { t, dir } = useLanguage();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        patientName: "",
        patientMobile: "",
        date: "",
    });

    const fetchRecords = async () => {
        setLoading(true);
        const query = new URLSearchParams(filters).toString();
        try {
            const res = await fetch(`/api/test-records?${query}`);
            const data = await res.json();
            setRecords(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRecords();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const clearFilters = () => {
        setFilters({ patientName: "", patientMobile: "", date: "" });
    };

    const headers = [
        t("fullName"),
        t("mobile"),
        t("referringDoctor"),
        t("sampleType"),
        t("result"),
        t("unit"),
        t("normalRange"),
        t("department"),
        t("timestamp"),
    ];

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8 bg-background min-h-screen">
            {/* Search & Filter Header */}
            <div className="flex flex-col xl:flex-row xl:items-center gap-6 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4">
                    <Clock size={160} className="rotate-12" />
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <button
                        onClick={clearFilters}
                        disabled={!filters.patientName && !filters.patientMobile && !filters.date}
                        className={`flex flex-col items-center gap-2 group transition-all ${(!filters.patientName && !filters.patientMobile && !filters.date) ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
                    >
                        <div className="p-4 bg-muted rounded-2xl group-active:scale-90 transition-all text-foreground border border-border/50">
                            <FilterX size={26} />
                        </div>
                        <span className="text-smaller font-black uppercase text-muted-foreground tracking-widest tajawal">
                            {t("clearFilters")}
                        </span>
                    </button>
                </div>

                <div className="h-14 w-[1px] bg-border mx-2 hidden xl:block opacity-50" />

                <div className="flex flex-wrap items-center gap-4 flex-1 relative z-10">
                    <div className="relative flex-1 min-w-[240px]">
                        <UserSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="text"
                            placeholder={t("patientName")}
                            value={filters.patientName}
                            onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
                            className="w-full pl-11 pr-4 py-4 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all tajawal"
                        />
                    </div>
                    <div className="relative flex-1 min-w-[200px]">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="text"
                            placeholder={t("patientMobile")}
                            value={filters.patientMobile}
                            onChange={(e) => setFilters({ ...filters, patientMobile: e.target.value })}
                            className="w-full pl-11 pr-4 py-4 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
                        />
                    </div>
                    <div className="relative flex-1 min-w-[180px]">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            className="w-full pl-11 pr-4 py-4 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border rounded-2xl text-[14px] font-bold outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all"
                        />
                    </div>

                    <div className="px-8 py-2.5 bg-brand/5 dark:bg-brand/10 border border-brand/20 rounded-2xl flex flex-col items-center min-w-[110px] backdrop-blur-sm">
                        <span className="text-tiny font-black text-brand uppercase tracking-[0.2em] tajawal">
                            {t("listCount")}
                        </span>
                        <span className="text-2xl font-black text-brand tabular-nums">{records.length}</span>
                    </div>
                </div>
            </div>

            {/* Main Table View */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Table headers={headers}>
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-40">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                                        <span className="text-muted-foreground animate-pulse font-medium tajawal">{t("initializingRecords")}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-40">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <FileText size={64} className="text-muted-foreground" />
                                        <span className="text-xl font-bold tajawal">{t("noExaminationsFound")}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            records.map((record, i) => (
                                <motion.tr
                                    key={record.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: i * 0.02 }}
                                    className="hover:bg-brand/[0.02] dark:hover:bg-brand/10 transition-colors group cursor-default"
                                >
                                    <td className="px-6 py-5 border-x border-border/30">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-smallish font-black uppercase ${record.gender === 'male' ? 'bg-blue-500/10 text-blue-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                                {record.fullName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-foreground tajawal">{record.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-muted-foreground border-x border-border/30 font-bold text-regular-sm tracking-tight">{record.mobile}</td>
                                    <td className="px-6 py-5 font-bold text-muted-foreground border-x border-border/30 tajawal text-intermediate">{record.doctor}</td>
                                    <td className="px-6 py-5 border-x border-border/30">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand/5 border border-brand/10 rounded-xl w-fit">
                                            <Beaker size={14} className="text-brand/60" />
                                            <span className="font-black text-brand text-smaller uppercase tracking-wider">{record.sample}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-black text-foreground border-x border-border/30 text-[15px]">{record.result}</td>
                                    <td className="px-6 py-5 text-muted-foreground border-x border-border/30 font-black text-smaller uppercase">{record.unit || "-"}</td>
                                    <td className="px-6 py-5 font-mono text-smallish text-muted-foreground border-x border-border/30 italic">{record.normalRange || "-"}</td>
                                    <td className="px-6 py-5 border-x border-border/30">
                                        <div className="px-3 py-1 bg-muted/50 rounded-lg text-muted-foreground tajawal text-smallish font-bold border border-border/50">
                                            {record.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 border-x border-border/30">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-smallish font-black text-foreground">{record.testTime}</span>
                                            <span className="text-tiny text-muted-foreground uppercase font-bold tracking-tighter opacity-60">GMT+3</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </AnimatePresence>
                </Table>
            </motion.div>
        </div>
    );
}

