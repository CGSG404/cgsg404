'use client';

import { useSearchParams } from 'next/navigation';
import MaintenancePage from '@/src/components/MaintenancePage';

export default function MaintenancePageRoute() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const page = searchParams.get('page');

  return (
    <MaintenancePage 
      message={message} 
      showBackButton={true}
      showHomeButton={page !== '/'}
    />
  );
}
