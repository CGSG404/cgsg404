'use client';

import CasinosHydrated from '@/components/CasinosHydrated';
import Image from 'next/image';
import Link from 'next/link';

interface CasinosClientProps {
  dehydratedState: any;
}

export default function CasinosClient({ dehydratedState }: CasinosClientProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Online Casinos',
    description: 'Complete list of online casinos reviewed by GuruSingapore',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: 'https://gurusingapore.com/casinos/example-casino-1',
        },
        {
          '@type': 'ListItem',
          position: 2,
          url: 'https://gurusingapore.com/casinos/example-casino-2',
        },
      ],
    },
  };

  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 sm:pb-20">
        <div className="container mx-auto flex max-w-6xl flex-col items-start gap-10 px-4 md:flex-row md:items-center">
          {/* LEFT TEXT */}
          <div className="max-w-xl flex-1">
            <nav className="mb-3 text-sm text-gray-400">
              <Link href="/" className="hover:text-casino-neon-green">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-300">Casinos</span>
            </nav>

            <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
              Listing Of Online Casinos for July 2025 – Expert Picks You Can Trust
            </h1>

            <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
              <Image
                src="/founder.png"
                alt="Author avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-medium text-gray-200">GuruSG.</span>
              <span>·</span>
              <time dateTime="2025-07-10">10 Jul 2025</time>
            </div>

            <p className="mt-6 text-gray-300">
              We've reviewed more than 87 online casinos to bring you the TOP 10 in July. Each is
              rated using our unique{' '}
              <span className="font-semibold text-casino-neon-green">Safety Index</span>—developed
              by experts, grounded in real casino data, and shaped by insights from our active
              community.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative mx-auto h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 flex-shrink-0">
            <Image
              src="/fair-logos.png"
              alt="Casino cards illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CasinosHydrated dehydratedState={dehydratedState} />
    </>
  );
}
