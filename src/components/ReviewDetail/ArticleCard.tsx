import Link from 'next/link';
import { type Article } from './types';

interface ArticleCardProps {
  reviewSlug: string;
  article: Article;
}

export const ArticleCard = ({ reviewSlug, article }: ArticleCardProps) => {
  // Pastikan reviewSlug dan article.slug ada sebelum render
  if (!reviewSlug || !article?.slug) {
    console.error('Missing required props: reviewSlug or article.slug');
    return null;
  }

  const articleUrl = `/reviews/${reviewSlug}/${article.slug}`;

  return (
    <Link
      href={articleUrl}
      className="block w-full cursor-pointer"
      aria-label={`Read article: ${article.title}`}
    >
      <article className="bg-[#1f2229]/80 rounded-xl border border-casino-neon-green/20 p-6 flex flex-col md:flex-row items-start gap-6">
        {article.imageUrl && (
          <div className="w-full md:w-48 flex-shrink-0 overflow-hidden rounded-lg relative z-10">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-32 md:h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-orange-400 mb-2">{article.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{article.summary}</p>
          <div className="mt-4">
            <span className="text-casino-neon-green text-sm">Read full article →</span>
          </div>
        </div>
      </article>
    </Link>
  );
};
