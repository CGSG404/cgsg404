import { fetchAllCasinos } from '@/lib/api';
import { QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import MaintenanceWrapper from '@/src/components/MaintenanceWrapper';
import CasinosClient from './CasinosClient';

// export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All Casinos | CGSG',
  description:
    'Browse our complete database of online casinos with detailed reviews and safety ratings.',
};

export default async function CasinosPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['casinos'],
    queryFn: fetchAllCasinos,
  });

  const casinosData = queryClient.getQueryData(['casinos']) ?? [];
  return (
    <MaintenanceWrapper>
      <CasinosClient dehydratedState={JSON.parse(JSON.stringify(casinosData))} />
    </MaintenanceWrapper>
  );
}
