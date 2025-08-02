import { Metadata } from 'next';
import TopCasinosClient from './TopCasinosClient';

// export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Top Casinos | CGSG',
  description: 'Browse popular casino game titles and guides.',
};

export default function TopCasinosPage() {
  return (
    <main className="relative overflow-hidden -mt-16">
      <TopCasinosClient />
    </main>
  );
}
