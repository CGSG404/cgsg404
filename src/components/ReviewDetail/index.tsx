import Image from "next/image";
import { type Review } from "./types";
import CasinoTabs from "../CasinoTabs";
import InfoCard from "./InfoCard";
import { Shield, Gift, Gamepad2, WalletCards } from "lucide-react";

interface Props {
  review: Review;
}

export default function ReviewDetail({ review }: Props) {
  if (!review) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* HERO */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white shadow-inner">
        {/* decorative graphic */}
        <div className="absolute inset-0">
          <Image src="/hero-casino.jpg" alt="casino background" fill className="object-cover object-center opacity-30" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 opacity-25 bg-[url('/textures/noise.png')] mix-blend-overlay pointer-events-none" />
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4 relative z-10 max-w-5xl">
          {/* logo badge */}
          <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-2xl shadow-lg ring-4 ring-white/30 overflow-hidden bg-white">
            <Image src={review.logo} alt={review.name} fill className="object-contain p-4" priority />
          </div>
          {/* title + meta */}
          <div className="text-center md:text-left space-y-4 max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
              {review.name}
            </h1>
            <p className="text-white/90 leading-relaxed md:text-lg">
              {review.description}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-sm font-semibold">
                Rating: {review.rating}/10
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-sm font-semibold">
                Bonus: {review.bonus}
              </span>
              {review.isNew && (
                <span className="bg-pink-500/90 px-3 py-1 rounded-full text-sm font-semibold">
                  NEW
                </span>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* MAIN */}
      <main className="container mx-auto max-w-6xl grid md:grid-cols-[260px_1fr] gap-10 px-4 py-12">
        

        
        <div className="mb-8">
          <div className="flex items-center gap-2 bg-green-100 p-4 rounded-lg">
            <Shield className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">
              Safety Index: {review.safetyIndex}
            </span>
          </div>
        </div>

        
        {review.badges && review.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {review.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-green-100 text-emerald-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Casino Tabs */}
        {/* SIDEBAR (sticky) */}
        <aside className="md:sticky md:top-32 self-start space-y-6 hidden md:block">
          <InfoCard icon={<Gift className="h-5 w-5" />} title="Welcome Bonus">
            <p>{review.bonus}</p>
            <a
              href={review.playUrl}
              target="_blank"
              rel="noreferrer"
              className="block mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 rounded-md text-sm font-medium"
            >
              Play Now
            </a>
          </InfoCard>
          <InfoCard icon={<Shield className="h-5 w-5" />} title="Safety Index">
            <p>{review.safetyIndex}</p>
          </InfoCard>
        </aside>

        {/* CONTENT */}
        <div className="space-y-10">
          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <InfoCard icon={<Gift className="h-6 w-6" />} title="Bonus & Rewards">
              <p>{review.bonus}</p>
            </InfoCard>
            <InfoCard icon={<Gamepad2 className="h-6 w-6" />} title="Games">
              <ul className="list-disc list-inside">
                {review.games.map((game, idx) => (
                  <li key={idx}>{game}</li>
                ))}
              </ul>
            </InfoCard>
            <InfoCard icon={<WalletCards className="h-6 w-6" />} title="Payment Methods">
              <ul className="list-disc list-inside">
                {review.paymentMethods.map((pm, idx) => (
                  <li key={idx}>{pm}</li>
                ))}
              </ul>
            </InfoCard>
          </div>

          {/* Badges */}
          {review.badges?.length && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-emerald-900">Features</h2>
              <div className="flex flex-wrap gap-2">
                {review.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TABS */}
          <CasinoTabs review={review} />
        </div>
      </main>
    </div>
  );
}
