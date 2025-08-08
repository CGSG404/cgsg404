'use client';

import { useState, useMemo } from 'react';
import Head from 'next/head';
import ProfessionalNavbar from '@/src/components/ProfessionalNavbar';
import Footer from '@/components/Footer';
import { Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MaintenanceWrapper from './MaintenanceWrapper';

const NewsPage = () => {
  // List of news articles (in a real app this would come from an API)
  const newsArticles = [
    {
      id: 1,
      title: 'CGSG Domain Officially Launched: Marking a New Era of Safer and More Trusted Online Gambling',
      excerpt:
        'Singapore July 2 2025 – CGSG (Casino Gaming Singapore Group) has officially launched its new domain marking a major milestone.',
      author: 'Moderator CGSG',
      date: 'July 2, 2025',
      category: 'CGSG',
      image: '/news-banner/domain1.png',
      readTime: 'CGSG News',
    },
    {
      id: 2,
      title: 'Coming Soon',
      excerpt:
        'Coming Soon.',
      author: 'GURU x YS',
      date: 'July 2, 2025',
      category: 'Gaming',
      image: '/news-banner/coming-soon.png',
      readTime: 'CGSG News',
    },
  ];

  const categories = useMemo(() => ['All', ...new Set(newsArticles.map((n) => n.category))], [newsArticles]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredArticles =
    selectedCategory === 'All'
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-casino-dark text-white">
      <ProfessionalNavbar />
      <Head>
        <title>Casino News</title>
      </Head>
      <section className="container mx-auto max-w-7xl px-4 py-16">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Latest <span className="gradient-text">News</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the newest developments in the online casino world.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border border-casino-border-subtle transition-colors duration-200 text-sm md:text-base ${
                selectedCategory === category
                  ? 'bg-casino-neon-green text-casino-dark'
                  : 'bg-transparent text-gray-300 hover:bg-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {/* Mobile Slider */}
        <div className="sm:hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1.1}
            className="pb-8"
          >
            {filteredArticles.map((article) => (
              <SwiperSlide key={article.id} className="pb-4 h-auto">
                <article className="bg-casino-card-bg/60 border border-casino-border-subtle rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                  <Image src={article.image} alt={article.title} width={400} height={160} className="w-full h-40 object-cover" unoptimized />
                  <div className="p-6 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold line-clamp-2 min-h-[56px]">
                      {article.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-3 min-h-[72px]">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" /> {article.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" /> {article.category}
                      </span>
                    </div>
                    <Link href={`/news/${article.id}`} className="mt-2 inline-block text-casino-neon-green hover:underline text-sm font-medium">
                      Read More →
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-casino-card-bg/60 border border-casino-border-subtle rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <Image src={article.image} alt={article.title} width={400} height={160} className="w-full h-40 object-cover" unoptimized />
              <div className="p-6 flex flex-col gap-4">
                <h2 className="text-xl font-semibold line-clamp-2 min-h-[56px]">
                  {article.title}
                </h2>

                <p className="text-gray-400 text-sm line-clamp-3 min-h-[72px]">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" /> {article.category}
                  </span>
                </div>

                <Link
                  href={`/news/${article.id}`}
                  className="mt-2 inline-block text-casino-neon-green hover:underline text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
      </div>
    </MaintenanceWrapper>
  );
};

export default NewsPage;
