import Image from "next/image";
import { type Review } from "./types";
import CasinoTabs from "../CasinoTabs";
import { Shield, Gift, Gamepad2, Languages, WalletCards } from "lucide-react";

interface Props {
  review: Review;
}

export default function ReviewDetail({ review }: Props) {
  if (!review) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-100 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white opacity-20 pointer-events-none"></div>
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:flex-row md:gap-10 md:text-left max-w-4xl relative z-10">
          {/* Logo & Title */}
          <div className="relative h-28 w-28 flex-shrink-0">
            <Image 
              src={review.logo} 
              alt={review.name} 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl text-emerald-900">
              {review.name}
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              {review.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold text-xl">
                  {review.rating}
                  <span className="text-gray-600">/10</span>
                </span>
                <span className="text-gray-400">•</span>
              </div>
              <span className="text-emerald-600 font-semibold text-lg">
                {review.bonus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-4">
              <Gift className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-semibold">Bonus & Rewards</span>
            </h3>
            <p className="text-gray-600">{review.bonus}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-4">
              <Gamepad2 className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-semibold">Games</span>
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {review.games.map((game, index) => (
                <li key={index}>{game}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-4">
              <WalletCards className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-semibold">Payment Methods</span>
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {review.paymentMethods.map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-2 bg-green-100 p-4 rounded-lg">
            <Shield className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">
              Safety Index: {review.safetyIndex}
            </span>
          </div>
        </div>

        {/* Casino Badges */}
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
        <CasinoTabs review={review} />
      </main>
    </div>
  );
}
