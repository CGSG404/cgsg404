'use client';
import dynamic from 'next/dynamic';

// Catch-all route that renders the legacy React Router app
// This prevents Next.js 404s for paths like /casinos, /games, etc.
// We rely on React Router inside src/App.tsx to handle the internal routing.

const LegacyApp = dynamic(() => import('../../src/App'), { ssr: false });

export default function LegacyFallback() {
  return <LegacyApp />;
}
