import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewsHero from '@/components/reviews/ReviewsHero';
import ReviewsGrid from '@/components/reviews/ReviewsGrid';
import ReviewsCTA from '@/components/reviews/ReviewsCTA';

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      
      <ReviewsHero />
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <ReviewsGrid />
          <ReviewsCTA />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
