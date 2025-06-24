
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasinoListings from '@/components/CasinoListings';
import { motion } from 'framer-motion';

const Casinos = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            All <span className="gradient-text">Casinos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our complete database of online casinos with detailed reviews and safety ratings.
          </p>
        </motion.div>
        <CasinoListings />
      </div>
      <Footer />
    </div>
  );
};

export default Casinos;
