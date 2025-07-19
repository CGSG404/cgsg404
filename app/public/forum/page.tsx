'use client';
import Link from "next/link";
import dynamic from "next/dynamic";

const ForumPage = dynamic(() => import('@/components/ForumPage'), { ssr: false });

export default function Forum() {
  return (
    <main className="relative overflow-hidden">
      <ForumPage />
    </main>
  );
}
