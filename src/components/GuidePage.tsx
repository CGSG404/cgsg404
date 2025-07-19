import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GuideHero from '@/components/guide/GuideHero';
import GuideComingSoon from '@/components/guide/GuideComingSoon';
import GuideTopics from '@/components/guide/GuideTopics';
import GuideCTA from '@/components/guide/GuideCTA';

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <GuideHero />
      <div className="py-16">
        <div className="container mx-auto px-4">
          <GuideComingSoon />
          <GuideTopics />
          <GuideCTA />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GuidePage;
