import Link from 'next/link';
import { type Article } from './types';

interface ArticleCardProps {
  reviewSlug: string;
  article: Article;
}

export const ArticleCard = ({ reviewSlug, article }: ArticleCardProps) => {
  return (
    <Link href={`/reviews/${reviewSlug}/${article.slug}`}>
      <div className="bg-[#1f2229]/80 rounded-xl shadow-lg border border-casino-neon-green/20 hover:border-casino-neon-green/40 transition-all duration-300 p-6 flex flex-col md:flex-row items-start gap-6 cursor-pointer">
        {article.imageUrl && (
          <div className="w-full md:w-48 flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-32 md:h-full object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-orange-400 mb-2">{article.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{article.summary}</p>
        </div>
      </div>
    </Link>
  );
};
