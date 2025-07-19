'use client';

import GamesHydrated from '@/components/GamesHydrated';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export default function GamesClient() {
  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <GamesHydrated dehydratedState={dehydratedState} />
    </>
  );
}
