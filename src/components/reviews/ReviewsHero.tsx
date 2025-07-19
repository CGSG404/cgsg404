
import { Star } from 'lucide-react';
import Image from 'next/image';

const ReviewsHero = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pb-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        {/* LEFT TEXT */}
        <div className="max-w-xl flex-1">
          <nav className="mb-3 text-sm text-gray-400">
            <a href="/" className="hover:text-casino-neon-green">Home</a>
            <span className="mx-2">›</span>
            <span className="text-gray-300">Reviews</span>
          </nav>
          <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
            Trusted Online Casino Reviews – Expert Picks You Can Trust
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
            <Image src="/founder.png" alt="Author avatar" width={32} height={32} className="rounded-full" />
            <span className="font-medium text-gray-200">GuruSG.</span>
            <span>·</span>
            <time dateTime="2025-07-10">10 Jul 2025</time>
          </div>
          <p className="mt-6 text-gray-300">
            Discover honest, in-depth reviews of the top online casinos from experienced players and our team of experts. Compare features, bonuses, customer support, and trust levels to make smarter choices.
          </p>
        </div>
        {/* RIGHT IMAGE */}
        <div className="relative mx-auto h-36 w-36 sm:h-48 sm:w-48 md:h-60 md:w-60 lg:h-72 lg:w-72 flex-shrink-0">
          <Image src="/cgsg-logos.png" alt="CGSG Trophy" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
};

export default ReviewsHero;
