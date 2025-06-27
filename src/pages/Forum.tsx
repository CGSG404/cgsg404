import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ForumHero from '@/components/forum/ForumHero';
import ForumStats from '@/components/forum/ForumStats';
import ForumCategories from '@/components/forum/ForumCategories';
import FeaturedTopics from '@/components/forum/FeaturedTopics';

const Forum = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      
      <ForumHero />
      <ForumStats />

      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Forum</span> <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
              Explore different topics and join conversations that interest you
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <ForumCategories />
              <FeaturedTopics />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Forum;
