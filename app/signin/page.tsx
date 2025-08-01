"use client";

import Link from "next/link";
import AuthPage from "@/src/components/AuthPage";
import AuthErrorBoundary from "@/src/components/AuthErrorBoundary";

export default function SignInPage() {
  return (
    <AuthErrorBoundary>
      <main className="relative overflow-hidden">
        <AuthPage />
      </main>
    </AuthErrorBoundary>
  );
}