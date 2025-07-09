'use client';
import dynamic from 'next/dynamic';

// Load the heavy ListReport page only on the client to avoid framer-motion issues and keep server bundle lean
const ListReportPage = dynamic(() => import('@/components/ListReportPage'), { ssr: false });

export default function ListReport() {
  return <ListReportPage />;
}
