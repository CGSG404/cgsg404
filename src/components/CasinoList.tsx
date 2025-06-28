import { useState, useMemo } from 'react';
import CasinoCard from './CasinoCard';

interface Casino {
  id: number;
  name: string;
  logo: string;
  rating: number;
  safetyIndex: 'Low' | 'Medium' | 'High' | 'Very High';
  bonus: string;
  features: string[];
  description: string;
  badges?: string[];
  isNew?: boolean;
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  playUrl: string;
}

interface CasinoListProps {
  casinos: Casino[];
  className?: string;
}

/**
 * Renders a search bar and responsive grid of `CasinoCard`s.
 * Filters casinos in-memory by case-insensitive substring match against the casino name.
 */
const CasinoList = ({ casinos, className }: CasinoListProps) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? casinos.filter((c) => c.name.toLowerCase().includes(term))
      : casinos;
  }, [search, casinos]);

  return (
    <div className={className}>
      {/* Search bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search casino…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 rounded-lg bg-casino-dark-lighter border border-casino-border-subtle focus:border-casino-neon-green outline-none placeholder-gray-500 text-sm"
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((casino) => (
          <CasinoCard key={casino.id} casino={casino} />
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-full text-center">No casinos matched your search.</p>
        )}
      </div>
    </div>
  );
};

export default CasinoList;
