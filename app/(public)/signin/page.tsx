"use client";

import Link from "next/link";
import AuthPage from "@/components/AuthPage";
import AnimatedBlurBG from "@/components/AnimatedBlurBG";

export default function SignInPage() {
  return (
    <main className="relative overflow-hidden">
      <AnimatedBlurBG />
      <AuthPage />
    </main>
  );
}