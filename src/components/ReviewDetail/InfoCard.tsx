"use client";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function InfoCard({ icon, title, children }: Props) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 group space-y-3">
      <h3 className="flex items-center gap-3 text-lg font-semibold">
        <span className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
          {icon}
        </span>
        <span className="text-gray-900 dark:text-gray-100">{title}</span>
      </h3>
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
