"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { UserRound, Search, FilterX, Trash2, Save, Edit, Stethoscope, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorsPage() {
    const { t, dir } = useLanguage();
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
    });

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/doctors");
            const data = await res.json();
            setDoctors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setFormData({
                id: doctor.id,
                name: doctor.name,
                description: doctor.description || "",
            });
            setIsEditing(true);
        } else {
            setFormData({
                id: "",
                name: "",
                description: "",
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        try {
            const res = await fetch("/api/doctors", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchDoctors();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this doctor?")) return;
        try {
            const res = await fetch(`/api/doctors?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchDoctors();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredDoctors = doctors.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 lg:p-10 space-y-8 bg-background min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-card border border-border p-6 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex flex-col items-center gap-2 group transition-all"
                    >
                        <div className="p-4 bg-brand rounded-2xl shadow-lg group-hover:bg-brand-hover group-active:scale-90 transition-all text-white">
                            <UserRound size={26} />
                        </div>
                        <span className="text-smaller font-black uppercase text-muted-foreground tracking-widest tajawal">
                            {t("newDoctor")}
                        </span>
                    </button>

                    <div className="h-14 w-[1px] bg-border opacity-50" />

                    <button
                        onClick={() => setSearchTerm("")}
                        disabled={!searchTerm}
                        className={`flex flex-col items-center gap-2 group transition-all ${!searchTerm ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
                    >
                        <div className="p-4 bg-muted rounded-2xl group-active:scale-90 transition-all text-foreground border border-border/50">
                            <FilterX size={26} />
                        </div>
                        <span className="text-smaller font-black uppercase text-muted-foreground tracking-widest tajawal">
                            {t("clearFilters")}
                        </span>
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                    <div className="relative flex-1 min-w-[300px] max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={20} />
                        <input
                            type="text"
                            placeholder={t("doctorsName")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all font-bold tajawal"
                        />
                    </div>

                    <div className="px-6 py-2.5 bg-muted/40 border border-border/60 rounded-2xl flex flex-col items-center min-w-[110px] backdrop-blur-sm">
                        <span className="text-tiny font-black text-muted-foreground/70 uppercase tracking-[0.2em] tajawal">
                            {t("listCount")}
                        </span>
                        <span className="text-2xl font-black text-foreground tabular-nums leading-none mt-1">
                            {filteredDoctors.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Table headers={[t("doctorsName"), t("description"), t("actions")]}>
                    {loading ? (
                        <tr>
                            <td colSpan={3} className="text-center py-32">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                                    <span className="text-muted-foreground animate-pulse font-medium tajawal">Loading doctors...</span>
                                </div>
                            </td>
                        </tr>
                    ) : filteredDoctors.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="text-center py-32">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <Stethoscope size={48} className="text-muted-foreground" />
                                    <span className="text-xl font-bold tajawal">No doctors found</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredDoctors.map((doctor, index) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    key={doctor.id}
                                    onClick={() => handleOpenModal(doctor)}
                                    className="hover:bg-brand/5 dark:hover:bg-brand/10 cursor-pointer transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-black group-hover:scale-110 transition-transform text-lg">
                                                {doctor.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-foreground tajawal text-base tracking-tight">
                                                {doctor.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-start gap-2 max-w-md">
                                            <Briefcase size={14} className="mt-1 text-muted-foreground/40 shrink-0" />
                                            <span className="text-muted-foreground text-sm tajawal line-clamp-2">
                                                {doctor.description || "-"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(doctor); }}
                                                className="group/btn p-2.5 text-muted-foreground bg-muted hover:bg-muted-foreground hover:text-white rounded-xl transition-all duration-300"
                                                title={t("edit")}
                                            >
                                                <Edit size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, doctor.id)}
                                                className="group/btn p-2.5 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300"
                                                title={t("delete")}
                                            >
                                                <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    )}
                </Table>
            </motion.div>

            {/* Doctor Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? t("editDoctor") || "Edit Doctor" : t("newDoctor")}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("doctorsName")}</label>
                        <div className="relative">
                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                required
                                className="w-full pl-12 pr-4 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-[15px] font-bold outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Dr. Jane Smith"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("description")}</label>
                        <textarea
                            className="w-full px-5 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal min-h-[120px]"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Specialization, clinic address, or affiliation..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-8 mt-4 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-8 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest hover:bg-muted rounded-2xl transition-all tajawal"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-10 py-4 bg-brand text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-brand/20 hover:bg-brand-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all tajawal"
                        >
                            <Save size={18} />
                            {t("save")}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
