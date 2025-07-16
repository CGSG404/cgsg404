import React from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import ReviewComments from './ReviewComments';
import { type Review, type Article } from './ReviewDetail/types';
import { ArticleCard } from './ReviewDetail/ArticleCard';

interface ReviewDetailProps {
  review: Review;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review }) => {
  return (
    <>
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Breadcrumbs (optional) */}
        <div className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link> &gt; 
          <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link> &gt; 
          <span className="text-white">{review.name}</span>
        </div>

        {/* Main Review Card */}
        <div className="bg-[#181a20]/80 rounded-2xl shadow-2xl border border-casino-neon-green/15 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo & Rating */}
            <div className="flex-shrink-0 w-full md:w-48 text-center">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl shadow-lg border border-white/10">
                <img src={review.logo} alt={`${review.name} logo`} className="w-32 h-32 mx-auto rounded-full object-contain" />
              </div>
              <div className="mt-4 text-2xl font-bold flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>{review.rating}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Our Score</div>
              {review.isNew && (
                <div className="mt-3 inline-block bg-casino-neon-green/10 text-casino-neon-green text-xs font-bold px-3 py-1 rounded-full border border-casino-neon-green/30">New</div>
              )}
            </div>

            {/* Review Details */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{review.name} Review</h1>
              <p className="mt-2 text-gray-300">{review.description}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {review.badges?.map((badge, index) => (
                  <span key={index} className="bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full">{badge}</span>
                ))}
              </div>

              {/* Key Info Table */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400 font-semibold">Welcome Bonus</span>
                  <span className="text-lg font-bold text-casino-neon-green">{review.bonus}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 font-semibold">Safety Index</span>
                  <span className={`text-lg font-bold ${review.safetyIndex === 'Very High' ? 'text-green-400' : 'text-yellow-400'}`}>{review.safetyIndex}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 font-semibold">Key Features</span>
                  <span className="text-gray-200">{review.features.join(', ')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 font-semibold">Payment Methods</span>
                  <span className="text-gray-200">{review.paymentMethods.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Types */}
          <div className="mt-6 pt-6 border-t border-gray-700/50 flex flex-wrap gap-3">
            {review.games.map((game, index) => (
              <span key={index} className="bg-blue-500/10 text-blue-300 text-sm font-semibold px-4 py-2 rounded-lg border border-blue-500/20">{game}</span>
            ))}
          </div>

          {/* Visited Count & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            <div className="text-xs text-gray-400">
              {review.visitedCount ? `${review.visitedCount.toLocaleString()} Has Already Visited!` : ''}
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold px-8 py-2 rounded-full shadow-lg transition-all">
              Play now
            </button>
          </div>
        </div>
      </div>

      {/* Section Artikel Dinamis */}
      <section className="max-w-3xl mx-auto mt-12 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-orange-400 mb-2">In-depth Reviews & Guides</h2>
        {review.articles && review.articles.length > 0 ? (
          review.articles.map((article: Article) => (
            <ArticleCard key={article.slug} reviewSlug={review.slug} article={article} />
          ))
        ) : (
          <div className="bg-[#181a20]/90 rounded-2xl p-8 text-center text-gray-400">
            <p>No in-depth review articles for this casino yet.</p>
          </div>
        )}
      </section>

      {/* Visitor Comments */}
      <ReviewComments reviewSlug={review.slug} />
    </>
  );
};

export default ReviewDetail;
