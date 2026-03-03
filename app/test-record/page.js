"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
    Plus, Trash2, Save, RefreshCw, ChevronLeft, ChevronRight, Search,
    User, Calendar as CalendarIcon, Phone, MapPin, Cake, Activity,
    Printer, Cloud, Clock, UserCheck, Stethoscope, ChevronDown, CheckCircle2,
    FileText, UserSquare, ShieldCheck, Zap, FilterX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TestRecordPage() {
    const { t, dir } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [metadata, setMetadata] = useState({ patients: [], doctors: [], tests: [] });

    // Navigation state
    const [recentRecords, setRecentRecords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // Filterable Patient Search
    const [patientSearch, setPatientSearch] = useState("");
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [recordDate, setRecordDate] = useState("");
    const [recordTime, setRecordTime] = useState("");
    const [testRows, setTestRows] = useState([{ testId: "", value: "", unit: "", range: "" }]);

    const fetchMetadata = async (preselectedPatientId) => {
        setLoading(true);
        try {
            const [metaRes, historyRes] = await Promise.all([
                fetch("/api/lab"),
                fetch("/api/test-records?raw=true&limit=50")
            ]);

            const metaData = await metaRes.json();
            const historyData = await historyRes.json();

            setMetadata(metaData);
            setRecentRecords(historyData);

            if (preselectedPatientId) {
                const patient = metaData.patients.find(p => p.id === preselectedPatientId);
                if (patient) {
                    setSelectedPatient(patient);
                    setPatientSearch(patient.fullName);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        setRecordDate(new Date().toISOString().split('T')[0]);
        setRecordTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        const urlParams = new URLSearchParams(window.location.search);
        const patientId = urlParams.get("patientId");
        fetchMetadata(patientId);
    }, []);

    const loadRecordIntoForm = (record) => {
        const patient = metadata.patients.find(p => p.id === record.patientId);
        setSelectedPatient(patient || null);
        setPatientSearch(patient?.fullName || "");
        setSelectedDoctor(record.doctorId);

        const dateObj = new Date(record.date);
        setRecordDate(dateObj.toISOString().split('T')[0]);
        setRecordTime(dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

        const rows = record.results.map(r => ({
            testId: r.testId,
            value: r.value,
            unit: r.test.unit || "",
            range: r.test.normalRange || ""
        }));
        setTestRows(rows.length ? rows : [{ testId: "", value: "", unit: "", range: "" }]);
    };

    const navigateRecord = (direction) => {
        if (recentRecords.length === 0) return;

        let nextIndex;
        if (direction === "next") {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : -1;
        } else {
            nextIndex = currentIndex < recentRecords.length - 1 ? currentIndex + 1 : currentIndex;
        }

        setCurrentIndex(nextIndex);

        if (nextIndex === -1) {
            resetForm();
        } else {
            loadRecordIntoForm(recentRecords[nextIndex]);
        }
    };

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setPatientSearch(patient.fullName);
        setShowPatientDropdown(false);
    };

    const addRow = () => {
        setTestRows([...testRows, { testId: "", value: "", unit: "", range: "" }]);
    };

    const removeRow = (index) => {
        const newRows = testRows.filter((_, i) => i !== index);
        setTestRows(newRows.length ? newRows : [{ testId: "", value: "", unit: "", range: "" }]);
    };

    const updateRow = (index, field, val) => {
        const newRows = [...testRows];
        newRows[index][field] = val;

        if (field === "testId") {
            const test = metadata.tests.find(t => t.id === val);
            if (test) {
                newRows[index].unit = test.unit || "";
                newRows[index].range = test.normalRange || "";
            }
        }
        setTestRows(newRows);
    };

    const handleSave = async () => {
        if (!selectedPatient || !selectedDoctor) {
            alert(t("patientSelection") + " & " + t("assignDoctor"));
            return;
        }

        const payload = {
            patientId: selectedPatient.id,
            doctorId: selectedDoctor,
            date: `${recordDate}T${recordTime}:00`,
            results: testRows.filter(r => r.testId && r.value).map(r => ({
                testId: r.testId,
                value: r.value
            }))
        };

        if (payload.results.length === 0) {
            alert("No test results entered");
            return;
        }

        try {
            const res = await fetch("/api/lab", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Saved successfully!");
                resetForm();
                fetchMetadata(); // Refresh history
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setSelectedPatient(null);
        setPatientSearch("");
        setSelectedDoctor("");
        setRecordDate(new Date().toISOString().split('T')[0]);
        setRecordTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        setTestRows([{ testId: "", value: "", unit: "", range: "" }]);
        setCurrentIndex(-1);
    };

    const handlePrint = () => {
        if (!selectedPatient || testRows.length === 0 || !testRows[0].testId) {
            alert("Nothing to print");
            return;
        }
        window.print();
    };

    const filteredPatients = metadata.patients.filter(p =>
        p.fullName.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.mobile.includes(patientSearch)
    );

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden p-4 md:p-8 lg:p-10 space-y-6">
            {/* Header Form */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Patient Search Dropdown (The Key Feature) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm relative overflow-visible flex flex-col gap-6"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Search size={140} className="rotate-6" />
                    </div>

                    <div className="flex items-center justify-between relative z-10 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand/10 text-brand rounded-2xl shadow-sm">
                                <UserCheck size={24} />
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground tajawal">{t("patientSelection")}</h3>
                        </div>

                        <button
                            onClick={resetForm}
                            disabled={!patientSearch && !selectedPatient && !selectedDoctor && currentIndex === -1 && testRows.length === 1 && !testRows[0].testId}
                            className={`group flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted text-muted-foreground rounded-xl border border-border/50 transition-all ${(!patientSearch && !selectedPatient && !selectedDoctor && currentIndex === -1 && testRows.length === 1 && !testRows[0].testId) ? 'opacity-30' : 'opacity-100'}`}
                            title={t("clearFilters")}
                        >
                            <FilterX size={16} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-tiny font-black uppercase tracking-widest tajawal">{t("clearFilters")}</span>
                        </button>
                    </div>

                    <div className="relative z-30">
                        <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 mb-2 block tajawal">{t("fullName")}</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" size={18} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-10 py-4 bg-muted/30 hover:bg-muted/50 border border-border focus:border-brand rounded-2xl text-[15px] font-bold outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal"
                                placeholder={t("selectPatient")}
                                value={patientSearch}
                                onChange={(e) => {
                                    setPatientSearch(e.target.value);
                                    setShowPatientDropdown(true);
                                }}
                                onFocus={() => setShowPatientDropdown(true)}
                            />
                            {showPatientDropdown && patientSearch && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                                    <div className="max-h-60 overflow-y-auto no-scrollbar">
                                        {filteredPatients.length > 0 ? (
                                            filteredPatients.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => selectPatient(p)}
                                                    className="p-4 hover:bg-brand/5 cursor-pointer border-b border-border/40 last:border-0 transition-colors flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-bold tajawal text-sm">{p.fullName}</p>
                                                        <p className="text-smaller text-muted-foreground">{p.mobile}</p>
                                                    </div>
                                                    <span className={`text-smaller font-black uppercase px-2 py-1 rounded-lg ${p.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>{t(p.gender)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-xs text-muted-foreground tajawal italic">No matches found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {selectedPatient && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border/50 pt-4">
                                <div className="space-y-1">
                                    <label className="text-tiny font-black text-muted-foreground uppercase opacity-60 tracking-widest">{t("gender")}</label>
                                    <p className="text-sm font-bold text-foreground tajawal">{t(selectedPatient.gender)}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-tiny font-black text-muted-foreground uppercase opacity-60 tracking-widest">{t("dob")}</label>
                                    <p className="text-sm font-mono font-bold text-foreground">{selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : "-"}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-tiny font-black text-muted-foreground uppercase opacity-60 tracking-widest">{t("address")}</label>
                                    <p className="text-sm font-bold text-foreground tajawal leading-tight">{selectedPatient.address || "-"}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Visit Metadata (Doctor Selection) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col gap-6"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity size={140} className="-rotate-6" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10 border-b border-border/50 pb-4">
                        <div className="p-3 bg-brand/10 text-brand rounded-2xl shadow-sm">
                            <Stethoscope size={24} />
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground tajawal">{t("visitMetadata")}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 tajawal">{t("assignDoctor")}</label>
                            <div className="relative group">
                                <UserSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" size={18} />
                                <select
                                    className="w-full pl-12 pr-10 py-4 bg-muted/40 hover:bg-muted/60 border border-border focus:border-brand rounded-2xl text-[14px] font-bold outline-none focus:ring-8 focus:ring-brand/5 transition-all tajawal appearance-none text-foreground"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                >
                                    <option value="" className="bg-card text-foreground">{t("selectDoctor")}</option>
                                    {metadata.doctors.map(d => <option key={d.id} value={d.id} className="bg-card text-foreground">{d.name} ({d.description || "-"})</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 tajawal">{t("testDate")}</label>
                            <input
                                type="date"
                                value={recordDate}
                                onChange={(e) => setRecordDate(e.target.value)}
                                className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-[14px] font-bold focus:ring-8 focus:ring-brand/5 focus:border-brand outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-smaller font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 tajawal">{t("testTime")}</label>
                            <input
                                type="time"
                                value={recordTime}
                                onChange={(e) => setRecordTime(e.target.value)}
                                className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-[14px] font-bold focus:ring-8 focus:ring-brand/5 focus:border-brand outline-none transition-all"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Action Area */}
            <div className="flex-1 flex overflow-hidden gap-8">
                {/* Horizontal Toolbar for Buttons - More intuitive */}
                <div className="w-24 md:w-32 flex flex-col gap-4">
                    <button onClick={addRow} className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:bg-brand/5 hover:border-brand active:scale-95 transition-all group flex-1">
                        <Plus className="text-brand group-hover:scale-110" />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-2 tajawal">{t("addRecord")}</span>
                    </button>
                    <button onClick={() => navigateRecord("next")} className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:bg-muted active:scale-95 transition-all group flex-1">
                        <ChevronRight className="text-muted-foreground group-hover:scale-110" />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-2 tajawal">{t("nextRecord")}</span>
                    </button>
                    <button onClick={() => navigateRecord("prev")} className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:bg-muted active:scale-95 transition-all group flex-1">
                        <ChevronLeft className="text-muted-foreground group-hover:scale-110" />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-2 tajawal">{t("previousRecord")}</span>
                    </button>
                    <button onClick={handlePrint} className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:bg-amber-50 hover:border-amber-300 active:scale-95 transition-all group flex-1">
                        <Printer className="text-amber-500 group-hover:scale-110" />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-2 tajawal">{t("print")}</span>
                    </button>
                    <div className="h-4" />
                    <button onClick={handleSave} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-brand text-white shadow-xl shadow-brand/30 hover:shadow-brand/40 active:scale-95 transition-all group shrink-0 h-32">
                        <Cloud size={32} className="group-hover:scale-110 mb-2" />
                        <span className="text-smaller font-black uppercase tracking-widest tajawal">{t("commit")}</span>
                    </button>
                </div>

                {/* Test Entry Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-auto bg-card border border-border rounded-[2.5rem] shadow-sm relative no-scrollbar flex flex-col"
                >
                    <div className="sticky top-0 bg-card/80 backdrop-blur-xl z-20 p-8 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="text-brand" size={24} />
                            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground tajawal">Testing Environment</h2>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-2 bg-muted/40 border border-border/40 rounded-2xl">
                            <ShieldCheck className="text-green-500" size={16} />
                            <span className="text-tiny font-black uppercase tracking-widest text-muted-foreground tajawal">Validated by Meran Logic System</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-smaller font-black uppercase text-muted-foreground/50 tracking-widest border-b border-border/20">
                                    <th className="px-10 py-6 text-left tajawal">{t("testName")}</th>
                                    <th className="px-10 py-6 text-left tajawal">{t("value")}</th>
                                    <th className="px-10 py-6 text-left tajawal">{t("unit")}</th>
                                    <th className="px-10 py-6 text-left tajawal">{t("normalRange")}</th>
                                    <th className="px-10 py-6 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {testRows.map((row, idx) => (
                                        <motion.tr
                                            key={idx}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-brand/[0.02] transition-colors group"
                                        >
                                            <td className="p-4 px-10">
                                                <select
                                                    className="w-full px-5 py-4 bg-muted/20 border border-transparent hover:border-border/40 focus:border-brand/40 rounded-2xl outline-none text-[15px] font-bold tajawal appearance-none cursor-pointer h-14 text-foreground"
                                                    value={row.testId}
                                                    onChange={(e) => updateRow(idx, "testId", e.target.value)}
                                                >
                                                    <option value="" className="bg-card text-foreground">{t("selectTest")}</option>
                                                    {metadata.tests.map(t => <option key={t.id} value={t.id} className="bg-card text-foreground">{t.name}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-4 px-10">
                                                <input
                                                    className="w-full px-5 py-4 bg-brand/5 border border-transparent hover:border-brand/20 focus:border-brand focus:bg-background rounded-2xl outline-none text-[18px] font-black text-brand text-center h-14"
                                                    value={row.value}
                                                    onChange={(e) => updateRow(idx, "value", e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="px-10 py-4">
                                                <span className="px-4 py-2 bg-muted rounded-xl text-smallish font-black uppercase tracking-widest text-muted-foreground/80">
                                                    {row.unit || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-4">
                                                <span className="text-smallish font-mono font-bold text-muted-foreground italic tajawal">
                                                    {row.range || "Ref. Not Found"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-4 text-center">
                                                <button
                                                    onClick={() => removeRow(idx)}
                                                    className="p-3 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-12 border-t border-border/50 bg-muted/10">
                        <button
                            onClick={addRow}
                            className="w-full py-6 border-2 border-dashed border-border/50 rounded-[2rem] hover:border-brand/50 hover:bg-brand/5 transition-all flex items-center justify-center gap-4 group"
                        >
                            <div className="p-3 bg-brand/10 text-brand rounded-2xl group-hover:rotate-90 transition-transform duration-500">
                                <Plus size={24} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-brand transition-colors tajawal">{t("addExaminationEntry")}</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* HIGH-END PRINT TEMPLATE */}
            <div className="hidden print:block fixed inset-0 z-[9999] bg-white text-black p-0 print-area font-sans">
                <div className="p-10 border-b-8 border-brand flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-brand">MERAN CLINICAL LAB</h1>
                        <p className="text-smaller font-bold uppercase tracking-[0.3em] opacity-50">Scientific Excellence in Diagnostics</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="font-bold text-xs uppercase tracking-widest">Report Reference</p>
                        <p className="font-black text-lg">#{currentIndex !== -1 ? recentRecords[currentIndex]?.id : ('SESSION-' + (mounted ? Date.now().toString().slice(-6) : '......'))}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-stone-200 border-b border-stone-200">
                    <div className="p-8 bg-white space-y-4">
                        <h3 className="text-tiny font-black uppercase text-brand tracking-widest bg-brand/5 px-3 py-1 rounded w-fit">Patient Bio-Data</h3>
                        <div className="space-y-1">
                            <p className="font-black text-2xl uppercase">{selectedPatient?.fullName}</p>
                            <div className="flex gap-6 mt-2">
                                <p className="text-xs uppercase"><span className="opacity-40 font-black">Gender:</span> {selectedPatient?.gender}</p>
                                <p className="text-xs uppercase"><span className="opacity-40 font-black">Age:</span> {mounted && selectedPatient?.dob ? Math.floor((new Date() - new Date(selectedPatient.dob)) / 31536000000) : '-'}</p>
                            </div>
                            <p className="text-smaller opacity-60 font-mono mt-2">Patient PID: {selectedPatient?.id?.slice(0, 8)}</p>
                        </div>
                    </div>
                    <div className="p-8 bg-white space-y-4">
                        <h3 className="text-tiny font-black uppercase text-brand tracking-widest bg-brand/5 px-3 py-1 rounded w-fit">Clinical Reference</h3>
                        <div className="space-y-2">
                            <p className="font-bold text-sm">Referring Physician: <span className="font-black text-base">{metadata.doctors.find(d => d.id === selectedDoctor)?.name || 'N/A'}</span></p>
                            <p className="text-xs font-mono">Collection Date: {recordDate} {recordTime}</p>
                            <p className="text-smaller bg-stone-100 p-2 rounded border border-stone-200 uppercase font-black tracking-widest">Report Verified by Lab Director</p>
                        </div>
                    </div>
                </div>

                <div className="p-10">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b-4 border-stone-800 text-left">
                                <th className="py-6 px-4 font-black uppercase text-smallish tracking-widest">Investigation Parameter</th>
                                <th className="py-6 px-4 font-black uppercase text-smallish tracking-widest text-center">Observed Result</th>
                                <th className="py-6 px-4 font-black uppercase text-smallish tracking-widest">Unit</th>
                                <th className="py-6 px-4 font-black uppercase text-smallish tracking-widest">Reference Interval</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-stone-100">
                            {testRows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                                    <td className="py-6 px-4 font-black text-base">{metadata.tests.find(t => t.id === row.testId)?.name || 'Diagnostic Profile'}</td>
                                    <td className="py-6 px-4 text-center font-black text-2xl">{row.value}</td>
                                    <td className="py-6 px-4 font-bold opacity-60 uppercase">{row.unit}</td>
                                    <td className="py-6 px-4 text-xs italic font-semibold">{row.range}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-20 flex flex-col items-center border-t-2 border-stone-200 pt-10">
                        <div className="w-48 h-1 bg-stone-800 mb-2" />
                        <p className="text-smaller font-black uppercase tracking-[0.4em] mb-1">Authorization Signature</p>
                        <p className="text-[8px] opacity-40 uppercase tracking-widest text-center max-w-md mt-6 italic">
                            This report reflects the results of laboratory tests performed on the specimen provided.
                            Results should be interpreted by a qualified medical professional within clinical context.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex justify-between text-[8px] font-black uppercase tracking-[0.5em] opacity-30">
                    <p>Page 1 of 1</p>
                    <p>Generated by Meran Lab Management Suite v1.0.4</p>
                </div>
            </div>

            {/* Print Logic */}
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: A4; }
                    body { margin: 0; padding: 0; background: white !important; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { display: block !important; position: fixed !important; left: 0; top: 0; right: 0; bottom: 0; }
                }
            `}</style>
        </div>
    );
}
