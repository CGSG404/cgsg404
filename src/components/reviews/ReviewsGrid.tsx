
import ReviewCard from './ReviewCard';
import { casinos } from '@/src/data/casinos'; // Mengimpor data kasino yang sebenarnya

interface ReviewsGridProps {
  searchQuery: string;
}

const ReviewsGrid = ({ searchQuery }: ReviewsGridProps) => {
  // Menggunakan data dari casinos.tsx
  const reviews = casinos;

  const filteredReviews = reviews.filter(casino =>
    casino.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Latest Casino <span className="gradient-text">Reviews</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Comprehensive reviews based on real player experiences and expert analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredReviews.map((casino) => (
          <ReviewCard 
              key={casino.slug} // Menggunakan slug sebagai key unik
              casino={{
                id: casino.slug, // Menggunakan slug untuk id
                name: casino.name,
                logo: casino.logo,
                reviewUrl: `/reviews/${casino.slug}` // Membuat URL dinamis
              }}
            />
        ))}
      </div>
    </div>
  );
};

export default ReviewsGrid;
