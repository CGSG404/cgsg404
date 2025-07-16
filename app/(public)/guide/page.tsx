'use client';
import dynamic from 'next/dynamic';
import Link from "next/link";
import AnimatedBlurBG from "@/components/AnimatedBlurBG";

// Load the existing GuidePage component only on the client to avoid the framer-motion export * error.
const GuidePage = dynamic(() => import('@/components/GuidePage'), { ssr: false });

export default function Guide() {
  return (
    <main className="relative overflow-hidden">
      <AnimatedBlurBG />
      <GuidePage />
    </main>
  );
}
