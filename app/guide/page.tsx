'use client';
import Link from "next/link";
import MaintenanceWrapper from '@/src/components/MaintenanceWrapper';
import GuidePage from '@/components/GuidePage';

export default function Guide() {
  return (
    <MaintenanceWrapper>
      <main className="relative overflow-hidden">
        <GuidePage />
      </main>
    </MaintenanceWrapper>
  );
}
