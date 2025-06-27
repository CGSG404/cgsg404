'use client';
import dynamic from 'next/dynamic';

// Wrap legacy Vite/React application so it runs client-side inside Next.js
const LegacyApp = dynamic(() => import('../src/App'), { ssr: false });

export default function Home() {
  return <LegacyApp />;
}
