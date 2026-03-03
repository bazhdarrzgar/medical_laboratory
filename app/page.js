"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Microscope, Beaker, ClipboardList, Users, Stethoscope } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const [statsData, setStatsData] = useState({
    patients: 0,
    samples: 0,
    doctors: 0,
    testRecords: 0
  });

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStatsData(data);
      })
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { icon: <Users size={22} />, label: "patientsList", count: statsData.patients, color: "text-blue-500" },
    { icon: <Beaker size={22} />, label: "samples", count: statsData.samples, color: "text-emerald-500" },
    { icon: <ClipboardList size={22} />, label: "testRecord", count: statsData.testRecords, color: "text-amber-500" },
    { icon: <Stethoscope size={22} />, label: "doctorsList", count: statsData.doctors, color: "text-brand" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 lg:p-12 space-y-12 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="relative group mt-10 md:mt-20"
      >
        <div className="absolute -inset-12 bg-brand/5 dark:bg-brand/20 rounded-full blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:bg-brand/10" />
        <div className="relative p-14 md:p-16 bg-card rounded-full border border-border/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Microscope size={240} className="text-brand transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-center space-y-4 max-w-4xl px-4"
      >
        <h1 className="text-4xl lg:text-7xl font-black text-foreground tajawal tracking-tight leading-tight">
          تاقیگەی پزیشکی <span className="text-brand">میران</span><br />
          <span className="text-2xl lg:text-4xl opacity-90">بۆ شیکاری نەخۆشیەکان</span>
        </h1>
        <p className="text-muted-foreground text-smaller lg:text-sm uppercase tracking-[0.5em] font-black opacity-50 tajawal">
          Meran Medical Laboratory & Analysis Center
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-6xl pt-8 pb-20"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -12, scale: 1.02 }}
            className="flex flex-col items-center p-10 rounded-[2.5rem] bg-card/60 backdrop-blur-sm border border-border shadow-sm hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity translate-x-4 -translate-y-4">
              {React.cloneElement(stat.icon, { size: 120 })}
            </div>
            <div className={`${stat.color} mb-6 p-5 rounded-[1.5rem] bg-muted group-hover:bg-brand group-hover:text-white transition-all duration-500 shadow-inner`}>
              {stat.icon}
            </div>
            <span className="text-4xl font-black text-foreground mb-2 tabular-nums">{stat.count}</span>
            <span className="text-smaller text-muted-foreground uppercase font-black tracking-widest text-center tajawal opacity-60 group-hover:opacity-100 transition-opacity">
              {t(stat.label)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
