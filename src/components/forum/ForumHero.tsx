import Link from 'next/link';
import Image from 'next/image';

const ForumHero = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pb-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        {/* LEFT TEXT */}
        <div className="max-w-xl flex-1">
          <nav className="mb-3 text-sm text-gray-400">
            <a href="/" className="hover:text-casino-neon-green">Home</a>
            <span className="mx-2">›</span>
            <span className="text-gray-300">Forum</span>
          </nav>
          <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
            Casino Community Forum – Share, Learn, and Win Together
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
            <Image src="/founder.png" alt="Author avatar" width={32} height={32} className="rounded-full" />
            <span className="font-medium text-gray-200">GuruSG.</span>
            <span>·</span>
            <time dateTime="2025-07-10">10 Jul 2025</time>
          </div>
          <p className="mt-6 text-gray-300">
            Join thousands of players discussing strategies, sharing experiences, and helping each other win big! Connect, ask questions, and be part of the CGSG community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/auth" className="inline-flex">
              <button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded">
                Join the Discussion
              </button>
            </Link>
            <button
              className="border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green/10 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border rounded"
              onClick={() => {
                const section = document.getElementById('featured-topics');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Topics
            </button>
          </div>
        </div>
        {/* RIGHT IMAGE */}
        <div className="relative mx-auto h-36 w-36 sm:h-48 sm:w-48 md:h-60 md:w-60 lg:h-72 lg:w-72 flex-shrink-0">
          <Image src="/cgsg-logos.png" alt="CGSG Trophy" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
};

export default ForumHero;