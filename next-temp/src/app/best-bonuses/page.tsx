import { Button } from '@/components/ui/button';
import Image from 'next/image';

const casinos = [
  {
    id: 1,
    name: 'Neon Casino',
    profile: '/placeholder.svg',
    playUrl: 'https://neon-casino.com/play'
  },
  {
    id: 2,
    name: 'Star Luck',
    profile: '/placeholder.svg',
    playUrl: 'https://star-luck.com/play'
  }
  // ...tambahkan casino lain sesuai kebutuhan
];

export default function BestBonusesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-white">Best Bonuses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {casinos.map((casino) => (
          <div key={casino.id} className="bg-casino-card-bg rounded shadow p-6 flex flex-col items-center">
            <Image 
              src={casino.profile} 
              alt={casino.name} 
              width={80}
              height={80}
              className="w-20 h-20 rounded-full mb-4" 
            />
            <h2 className="text-lg font-semibold text-white mb-2">{casino.name}</h2>
            <Button
              asChild
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 mt-2"
            >
              <a href={casino.playUrl} target="_blank" rel="noopener noreferrer">
                Play Now
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
