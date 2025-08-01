'use client';

import GamesHydrated from '@/src/components/GamesHydrated';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export default function TopCasinosClient() {
  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <GamesHydrated dehydratedState={dehydratedState} />
    </>
  );
}
