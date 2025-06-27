
"use client";

import ReportCasinoCard from './ReportCasinoCard';

const FeaturedCasinos = () => {
  const featuredCasinos = [
    {
      id: 1,
      name: "Royal Spin Casino",
      logo: "/casino-logos/01COMING SOON.png",
      rating: 4.8,
      safetyIndex: "Very High" as const,
      bonus: "300% Welcome Bonus up to $3,000 + 150 Free Spins",
      features: ["Live Dealers", "Crypto Payments", "Mobile App", "24/7 Support"],
      description: "Premium online casino with exceptional game variety and top-tier security. Licensed and regulated with fast withdrawals.",
      badges: ["Top Rated", "Licensed"],
      isNew: false,
      links: {
        bonus: "/bonuses/royal-spin",
        review: "/reviews/royal-spin",
        complaint: "/complaints/royal-spin"
      }
    },
    {
      id: 2,
      name: "Diamond Elite",
      logo: "/casino-logos/01COMING SOON.png",
      rating: 4.9,
      safetyIndex: "Very High" as const,
      bonus: "400% Mega Bonus up to $4,000 + 200 Free Spins",
      features: ["High Roller", "Private Tables", "Concierge", "Exclusive Games"],
      description: "Luxury casino experience designed for high rollers with exclusive games and personalized service.",
      badges: ["VIP", "High Roller", "Exclusive"],
      isNew: true,
      links: {
        bonus: "/bonuses/diamond-elite",
        review: "/reviews/diamond-elite",
        complaint: "/complaints/diamond-elite"
      }
    },
    {
      id: 3,
      name: "Neon Palace",
      logo: "/casino-logos/01COMING SOON.png",
      rating: 4.7,
      safetyIndex: "Very High" as const,
      bonus: "200% Match Bonus up to $2,000 + 100 Free Spins",
      features: ["Slots", "Live Casino", "Sports Betting", "VIP Program"],
      description: "Modern casino platform with cutting-edge technology and extensive game library from top providers.",
      badges: ["Popular", "VIP", "New"],
      isNew: true,
      links: {
        bonus: "/bonuses/neon-palace",
        review: "/reviews/neon-palace",
        complaint: "/complaints/neon-palace"
      }
    },
  ];

  return (
    <div className="py-16 bg-casino-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Featured <span className="gradient-text">Casinos</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our top-rated online casinos with the best bonuses and highest safety ratings.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCasinos.map((casino) => (
            <ReportCasinoCard key={casino.id} casino={casino} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCasinos;