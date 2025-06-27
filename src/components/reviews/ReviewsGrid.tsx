
import ReviewCard from './ReviewCard';

interface ReviewsGridProps {
  searchQuery: string;
}

const ReviewsGrid = ({ searchQuery }: ReviewsGridProps) => {
  const reviews = [
    {
      id: 1,
      name: 'Lucky Dreams Casino',
      logo: '/placeholder.svg',
      rating: 4.2,
      userScore: 8.4,
      security: 'Official license, SSL encryption',
      bonus: 'Welcome Package up to $1000',
      quickReview: 'This site offers an exciting game selection and fast payouts. Their customer support is also very responsive.',
      pros: ['Crypto payments', 'VIP program', '24/7 support'],
      cons: ['Some games not available in certain regions'],
      reviewUrl: '/reviews/lucky-dreams'
    },
    {
      id: 2,
      name: 'Rabona Casino',
      logo: '/placeholder.svg',
      rating: 4.0,
      userScore: 7.9,
      security: 'Certified and independently audited',
      bonus: 'Weekly cashback + 200 free spins',
      quickReview: 'User experience is smooth, supports various payment methods, and the design is modern and mobile-friendly.',
      pros: ['Mobile-optimized', 'Wide selection of slot games'],
      cons: ['Not all bonuses are available for new users'],
      reviewUrl: '/reviews/rabona'
    }
  ];

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
