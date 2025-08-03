'use client';
import Link from "next/link";
import MaintenanceWrapper from '@/src/components/MaintenanceWrapper';
import ForumPage from '@/src/components/ForumPage';

export default function Forum() {
  return (
    <MaintenanceWrapper>
      <main className="relative overflow-hidden">
        <ForumPage />
      </main>
    </MaintenanceWrapper>
  );
}
