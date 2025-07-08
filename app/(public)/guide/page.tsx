'use client';
import dynamic from 'next/dynamic';

// Load the existing GuidePage component only on the client to avoid the framer-motion export * error.
const GuidePage = dynamic(() => import('@/components/GuidePage'), { ssr: false });

export default function Guide() {
  return <GuidePage />;
}
