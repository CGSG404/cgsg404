
import ReviewCard from './ReviewCard';

interface ReviewsGridProps {
  searchQuery: string;
  reviews?: typeof defaultReviews;
}

// default hard-coded list – can extend easily
const defaultReviews = [
  {
    id: 1,
    name: 'OnePlay Casino',
    logo: '/casino-logos/1play-withoutbg.png',
    reviewUrl: '/reviews/lucky-dreams'
  },
  {
    id: 2,
    name: 'Top1 Casino',
    logo: '/casino-logos/Top1-withoutbg.png',
    reviewUrl: '/reviews/rabona'
  }
] as const;

const ReviewsGrid = ({ searchQuery, reviews = defaultReviews }: ReviewsGridProps) => {

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
          <ReviewCard key={casino.id} casino={casino} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsGrid;
