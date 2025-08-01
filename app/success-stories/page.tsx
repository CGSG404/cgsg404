import Image from 'next/image';
import Link from "next/link";

export const metadata = {
  title: 'Success Stories | CasinoGuruSG',
  description: 'Ringkasan perjalanan singkat dan pencapaian utama CasinoGuruSG sejak 2021.',
};

export default function SuccessStoriesPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative overflow-hidden py-16">
        {/* blurred gradient background */}
        <div className="pointer-events-none absolute -inset-10 -z-10 select-none">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-casino-neon-green via-purple-600 to-indigo-600 opacity-30 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl px-4">
          <Image
            src="/success-stories-cgsg.png"
            alt="CasinoGuruSG milestones banner"
            width={1200}
            height={400}
            className="mb-10 w-full rounded-lg object-cover shadow-xl"
            priority
          />

        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 uppercase bg-gradient-to-r from-casino-neon-green via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Success Stories
        </h2>

        <p className="text-center text-lg leading-relaxed text-gray-300 mb-6">
          From the very beginning, <span className="font-semibold text-casino-neon-green">CasinoGuruSG</span> was built and developed independently by YS,{' '}
          <span className="font-semibold">an individual with a deep dedication to the world of iGaming.</span>  On May 17, 2025, a friend joined the mission to strengthen this vision.
          The project was handcrafted and designed by GURU (Leon Schneider), originally from Hamburg, Germany, with one core goal — to uphold transparency and fairness within the iGaming industry, specifically in the Singapore region.{' '}
          <span className="font-semibold text-casino-neon-green">With a strong focus on local players</span> CGSG is committed to creating a gaming environment that is fair, safe, and transparent. Although still in the development phase,
          we are here—growing, evolving, and supporting the player community in Singapore.
        </p>

        <p className="text-center text-lg leading-relaxed text-gray-300">
          This is only the beginning, and <span className="font-semibold text-casino-neon-green">we’re here for you</span>
          — championing fair play and helping every player experience iGaming with confidence.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-casino-neon-green px-6 py-3 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-casino-neon-green/50"
        >
          Back to Home
        </Link>
      </div>
    </section>
    </main>
  );
}