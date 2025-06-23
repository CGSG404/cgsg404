
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ForumHero from '@/components/forum/ForumHero';
import ForumStats from '@/components/forum/ForumStats';
import ForumCategories from '@/components/forum/ForumCategories';
import FeaturedTopics from '@/components/forum/FeaturedTopics';
import ForumCTA from '@/components/forum/ForumCTA';
import ForumChat from '@/components/forum/ForumChat';

const Forum = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      
      <ForumHero />
      <ForumStats />

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Forum <span className="gradient-text">Categories</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Explore different topics and join conversations that interest you
                </p>
              </div>

              <ForumCategories />
              <FeaturedTopics />
            </div>

            {/* Live Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ForumChat />
              </div>
            </div>
          </div>

          <ForumCTA />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Forum;
