'use client';
import { redirect } from 'next/navigation';

export default function LegacyFallback() {
  redirect('/');
  return null;
}
