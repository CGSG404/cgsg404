import ProfessionalNavbar from '@/src/components/ProfessionalNavbar';
import Footer from '@/components/Footer';
import CasinoListings from '@/components/CasinoListings';

const BonusesPage = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      {/* Add SimpleNavbar */}
      <ProfessionalNavbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Casino <span className="gradient-text">Bonuses</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find the best casino bonuses, free spins, and promotional offers updated daily.
          </p>
        </div>
        <CasinoListings />
      </div>
      <Footer />
    </div>
  );
};

export default BonusesPage;
