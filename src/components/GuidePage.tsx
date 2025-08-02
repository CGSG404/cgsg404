import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import GuideHero from '@/src/components/guide/GuideHero';
import GuideComingSoon from '@/src/components/guide/GuideComingSoon';
import GuideTopics from '@/src/components/guide/GuideTopics';
import GuideCTA from '@/src/components/guide/GuideCTA';
import MaintenanceWrapper from './MaintenanceWrapper';

const GuidePage = () => {
  return (
    <MaintenanceWrapper>
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
    </MaintenanceWrapper>
  );
};

export default GuidePage;
