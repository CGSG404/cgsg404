
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedCasinos from '@/components/FeaturedCasinos';
import LogoSlider from '@/components/LogoSlider';
import StatsGrid from '@/components/StatsGrid';
import Chart from '@/components/Chart';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <HeroSection />
      <FeaturedCasinos />
      <LogoSlider />
      <StatsGrid />
      <Chart />
      <Footer />
    </div>
  );
};

export default Index;
