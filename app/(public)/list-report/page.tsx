'use client';
import dynamic from 'next/dynamic';
import Link from "next/link";
import AnimatedBlurBG from "@/components/AnimatedBlurBG";

// Load the heavy ListReport page only on the client to avoid framer-motion issues and keep server bundle lean
const ListReportPage = dynamic(() => import('@/components/ListReportPage'), { ssr: false });

export default function ListReport() {
  return (
    <main className="relative overflow-hidden">
      <AnimatedBlurBG />
      <ListReportPage />
    </main>
  );
}
