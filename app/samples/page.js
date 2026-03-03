"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { Beaker, Search, FilterX, Trash2, Save, Edit, Layers, Tag, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SamplesPage() {
    const { t, dir } = useLanguage();
    const [samples, setSamples] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryTerm, setCategoryTerm] = useState("");
    const [unitTerm, setUnitTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        categoryId: "",
        normalRange: "",
        unit: "",
        price: "",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [samplesRes, catsRes] = await Promise.all([
                fetch("/api/samples"),
                fetch("/api/categories")
            ]);
            const samplesData = await samplesRes.json();
            const catsData = await catsRes.json();
            setSamples(samplesData);
            setCategories(catsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (sample = null) => {
        if (sample) {
            setFormData({
                id: sample.id,
                name: sample.name,
                categoryId: sample.categoryId,
                normalRange: sample.normalRange || "",
                unit: sample.unit || "",
                price: sample.price || "",
            });
            setIsEditing(true);
        } else {
            setFormData({
                id: "",
                name: "",
                categoryId: "",
                normalRange: "",
                unit: "",
                price: "",
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = isEditing ? "PUT" : "POST";
        try {
            const res = await fetch("/api/samples", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this test?")) return;
        try {
            const res = await fetch(`/api/samples?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredSamples = samples.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        s.category.name.toLowerCase().includes(categoryTerm.toLowerCase()) &&
        (s.unit || "").toLowerCase().includes(unitTerm.toLowerCase())
    );

    const clearFilters = () => {
        setSearchTerm("");
        setCategoryTerm("");
        setUnitTerm("");
    };

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
                            <Beaker size={26} />
                        </div>
                        <span className="text-smaller font-black uppercase text-muted-foreground tracking-widest tajawal">
                            {t("newSample")}
                        </span>
                    </button>

                    <div className="h-14 w-[1px] bg-border opacity-50" />

                    <button
                        onClick={clearFilters}
                        disabled={!searchTerm && !categoryTerm && !unitTerm}
                        className={`flex flex-col items-center gap-2 group transition-all ${(!searchTerm && !categoryTerm && !unitTerm) ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
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
                    <div className="relative flex-1 min-w-[200px] max-w-[240px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="text"
                            placeholder={t("sampleName")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all font-bold tajawal"
                        />
                    </div>
                    <div className="relative flex-1 min-w-[180px] max-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="text"
                            placeholder={t("categoryName")}
                            value={categoryTerm}
                            onChange={(e) => setCategoryTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all tajawal"
                        />
                    </div>
                    <div className="relative flex-1 min-w-[120px] max-w-[150px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <input
                            type="text"
                            placeholder={t("unit")}
                            value={unitTerm}
                            onChange={(e) => setUnitTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all uppercase text-xs font-black tracking-widest"
                        />
                    </div>

                    <div className="px-6 py-2.5 bg-muted/40 border border-border/60 rounded-2xl flex flex-col items-center min-w-[110px] backdrop-blur-sm">
                        <span className="text-tiny font-black text-muted-foreground/70 uppercase tracking-[0.2em] tajawal">
                            {t("listCount")}
                        </span>
                        <span className="text-2xl font-black text-foreground tabular-nums leading-none mt-1">
                            {filteredSamples.length}
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
                <Table headers={[t("testName"), t("categoryName"), t("price"), t("normalRange"), t("unit"), t("actions")]}>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-32">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                                    <span className="text-muted-foreground animate-pulse font-medium tajawal">Loading test catalogue...</span>
                                </div>
                            </td>
                        </tr>
                    ) : filteredSamples.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-32">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <Activity size={48} className="text-muted-foreground" />
                                    <span className="text-xl font-bold tajawal">No tests found</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredSamples.map((sample, index) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                    key={sample.id}
                                    onClick={() => handleOpenModal(sample)}
                                    className="hover:bg-brand/5 dark:hover:bg-brand/10 cursor-pointer transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-sm border border-brand/5">
                                                {sample.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-foreground tajawal text-base tracking-tight truncate max-w-[240px]">
                                                {sample.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 p-2 px-3 bg-muted/40 rounded-xl border border-border/50 w-fit">
                                            <Layers size={14} className="text-brand/60" />
                                            <span className="text-muted-foreground text-xs font-bold tajawal">
                                                {sample.category.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 p-2 px-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20 w-fit">
                                            <span className="text-sm font-black tabular-nums">
                                                {Number(sample.price).toLocaleString()} IQD
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-muted-foreground text-xs font-mono font-medium italic">
                                            {sample.normalRange || "-"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 p-2 px-4 bg-brand/5 text-brand rounded-xl border border-brand/10 w-fit min-w-[70px] justify-center">
                                            <span className="text-smaller font-black uppercase tracking-widest leading-none">
                                                {sample.unit || "N/A"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(sample); }}
                                                className="group/btn p-2.5 text-muted-foreground bg-muted hover:bg-muted-foreground hover:text-white rounded-xl transition-all duration-300"
                                                title={t("edit")}
                                            >
                                                <Edit size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, sample.id)}
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

            {/* Sample Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? t("editSample") : t("newSample")}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("testName")}</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                required
                                className="w-full pl-12 pr-4 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-[15px] font-bold outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Total PSA, HbA1c..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("categoryList")}</label>
                        <select
                            required
                            className="w-full px-5 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm font-bold outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal cursor-pointer appearance-none"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">{t("selectCategory")}</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("price")} (IQD)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-5 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-[15px] font-black outline-none focus:ring-8 focus:ring-brand/5 transition-all tabular-nums"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("normalRange")}</label>
                            <input
                                className="w-full px-5 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal"
                                value={formData.normalRange}
                                onChange={(e) => setFormData({ ...formData, normalRange: e.target.value })}
                                placeholder="e.g. 0.0 - 4.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-1 block tajawal">{t("unit")}</label>
                            <input
                                className="w-full px-5 py-4 bg-muted/40 border border-border/80 focus:border-brand rounded-2xl text-sm outline-none focus:ring-8 focus:ring-brand/5 transition-all uppercase font-bold"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="e.g. ng/mL"
                            />
                        </div>
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
