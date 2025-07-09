'use client';
import dynamic from 'next/dynamic';

const ForumPage = dynamic(() => import('@/components/ForumPage'), { ssr: false });

export default function Forum() {
  return <ForumPage />;
}
