"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Table({ headers, children }) {
    const { dir } = useLanguage();

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm transition-all duration-300">
            <table className="w-full text-sm text-left rtl:text-right border-collapse">
                <thead className="bg-muted text-muted-foreground font-bold uppercase tracking-wider text-smaller border-b border-border">
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i} className="px-6 py-4 border-x first:border-l-0 last:border-r-0 border-border">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {children}
                </tbody>
            </table>
        </div>
    );
}
