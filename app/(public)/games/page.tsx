import { Metadata } from 'next';
import GamesClient from './GamesClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Top Casinos | CGSG',
  description: 'Browse popular casino game titles and guides.',
};

export default function GamesPage() {
  return (
    <main className="relative overflow-hidden">
      <GamesClient />
    </main>
  );
}
