"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { Plus, Search, FilterX, UserPlus, Trash2, Save, Edit, FilePlus, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PatientsPage() {
    const { t, dir } = useLanguage();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileTerm, setMobileTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        id: "",
        fullName: "",
        gender: "male",
        dob: "",
        address: "",
        mobile: "",
    });

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/patients");
            const data = await res.json();
            setPatients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleOpenModal = (patient = null) => {
        if (patient) {
            setFormData({
                id: patient.id,
                fullName: patient.fullName,
                gender: patient.gender,
                dob: patient.dob || "",
                address: patient.address || "",
                mobile: patient.mobile,
            });
            setIsEditing(true);
        } else {
            setFormData({
                id: "",
                fullName: "",
                gender: "male",
                dob: "",
                address: "",
                mobile: "",
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        setSaving(true);
        setFormError("");
        try {
            const res = await fetch("/api/patients", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setIsModalOpen(false);
                fetchPatients();
            } else {
                setFormError(data.error || "An unknown error occurred.");
            }
        } catch (error) {
            console.error(error);
            setFormError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this patient?")) return;
        try {
            const res = await fetch(`/api/patients?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                fetchPatients();
            } else if (res.status === 409) {
                alert(`⚠️ ${data.error}`);
            } else {
                alert(`Error: ${data.error || "Could not delete patient."}`);
            }
        } catch (error) {
            console.error(error);
            alert("Network error. Please try again.");
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setMobileTerm("");
    };

    const filteredPatients = patients.filter(
        (p) =>
            p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            p.mobile.includes(mobileTerm)
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
                            <UserPlus size={26} />
                        </div>
                        <span className="text-smaller font-black uppercase text-muted-foreground tracking-widest tajawal">
                            {t("newPatient")}
                        </span>
                    </button>

                    <div className="h-14 w-[1px] bg-border opacity-50" />

                    <button
                        onClick={clearFilters}
                        disabled={!searchTerm && !mobileTerm}
                        className={`flex flex-col items-center gap-2 group transition-all ${(!searchTerm && !mobileTerm) ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
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
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={20} />
                        <input
                            type="text"
                            placeholder={t("patientName")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all tajawal"
                        />
                    </div>
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={20} />
                        <input
                            type="text"
                            placeholder={t("patientMobile")}
                            value={mobileTerm}
                            onChange={(e) => setMobileTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all font-mono"
                        />
                    </div>

                    <div className="px-6 py-2.5 bg-muted/40 border border-border/60 rounded-2xl flex flex-col items-center min-w-[110px] backdrop-blur-sm">
                        <span className="text-tiny font-black text-muted-foreground/70 uppercase tracking-[0.2em] tajawal">
                            {t("listCount")}
                        </span>
                        <span className="text-2xl font-black text-foreground tabular-nums leading-none mt-1">
                            {filteredPatients.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                <Table headers={[t("fullName"), t("gender"), t("mobile"), t("actions")]}>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="text-center py-32">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                                    <span className="text-muted-foreground animate-pulse font-medium tajawal">Loading data...</span>
                                </div>
                            </td>
                        </tr>
                    ) : filteredPatients.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-32">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <Search size={48} className="text-muted-foreground" />
                                    <span className="text-xl font-bold tajawal">{t("noRecordsFound")}</span>
                                    <p className="text-sm tajawal">Try adjusting your search criteria</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredPatients.map((patient, index) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    key={patient.id}
                                    onClick={() => handleOpenModal(patient)}
                                    className="hover:bg-brand/5 dark:hover:bg-brand/10 cursor-pointer transition-colors group relative"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black transition-transform group-hover:scale-110 ${patient.gender === 'male' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'}`}>
                                                {patient.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-foreground tajawal text-base tracking-tight truncate max-w-[300px]">
                                                {patient.fullName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center justify-center min-w-[80px] px-4 py-1.5 rounded-xl text-smaller font-black uppercase tracking-widest tajawal ${patient.gender === 'male' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/50' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100/50 dark:border-rose-800/50'}`}>
                                            {t(patient.gender)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-mono text-muted-foreground text-sm tracking-wider">
                                        {patient.mobile}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <Link
                                                href={`/test-record?patientId=${patient.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="group/btn p-2.5 text-brand bg-brand/5 hover:bg-brand hover:text-white rounded-xl transition-all duration-300"
                                                title={t("newTest")}
                                            >
                                                <FilePlus size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(patient); }}
                                                className="group/btn p-2.5 text-muted-foreground bg-muted hover:bg-muted-foreground hover:text-white rounded-xl transition-all duration-300"
                                                title={t("edit")}
                                            >
                                                <Edit size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, patient.id)}
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

            {/* Patient Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setFormError(""); }}
                title={isEditing ? t("editPatient") : t("registerNewPatient")}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    {formError && (
                        <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold tajawal">
                            ⚠️ {formError}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("fullName")}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                required
                                className="w-full pl-12 pr-4 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("gender")}</label>
                            <div className="grid grid-cols-2 gap-3 p-1.5 bg-muted/40 rounded-2xl border border-border/80">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: "male" })}
                                    className={`py-2.5 rounded-xl font-bold text-xs transition-all tajawal ${formData.gender === "male" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-muted-foreground hover:bg-white/10"}`}
                                >
                                    {t("male")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: "female" })}
                                    className={`py-2.5 rounded-xl font-bold text-xs transition-all tajawal ${formData.gender === "female" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-muted-foreground hover:bg-white/10"}`}
                                >
                                    {t("female")}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("dob")}</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3.5 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all cursor-pointer"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("address")}</label>
                        <input
                            className="w-full px-4 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Current city or regional address"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("mobile")}</label>
                        <input
                            required
                            className="w-full px-4 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all font-mono"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            placeholder="07XX XXX XXXX"
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
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-4 bg-brand text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-brand/20 hover:bg-brand-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all tajawal disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {saving ? "Saving..." : t("save")}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
