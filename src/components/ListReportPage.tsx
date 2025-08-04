'use client';

import Footer from '@/components/Footer';
import SimpleNavbar from '@/src/components/SimpleNavbar';
import MaintenanceWrapper from './MaintenanceWrapper';

const ListReportPage = () => {
  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-casino-dark">
        {/* Add SimpleNavbar */}
        <SimpleNavbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">
              List <span className="gradient-text">Report</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Report issues with casino listings and help us maintain accurate information.
            </p>
          </div>
          
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              We're developing a comprehensive reporting system. Stay tuned!
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </MaintenanceWrapper>
  );
};

export default ListReportPage;
