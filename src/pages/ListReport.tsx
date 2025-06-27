
import { useState, useMemo } from 'react';
import { reports as reportData, ReportData } from '@/data/reportData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import ReportCard from '@/components/ReportCard';

const ListReport = () => {
  const [reports, setReports] = useState<ReportData[]>(reportData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? reports.filter(r => r.casinoName.toLowerCase().includes(term)) : reports;
  }, [search, reports]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unlicensed':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Scam Indicated':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Many Users Reported':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    return <AlertTriangle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Find Reports…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 px-4 py-2 rounded-lg bg-casino-dark-lighter border border-casino-border-subtle focus:border-casino-neon-green outline-none placeholder-gray-500 text-sm text-white"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            List Report – <span className="gradient-text text-red-400">Bad List</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          List of online casino sites reported by users for not having an official license, 
          scam, or poor service.
          </p>
        </div>

        <div className="space-y-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              casinoName={report.casinoName}
              reportDate={report.lastReported}
              issue={report.summary}
              isLicensed={report.status === 'Unlicensed' ? false : true}
              reportUrl={report.url}
              className="w-full"
            />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Card className="bg-casino-card-bg border-casino-border-subtle p-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Report</h3>
              <p className="text-gray-400">
              Currently, no casino sites have been reported as problematic.
              </p>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-casino-card-bg border-casino-border-subtle p-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Alert!!</h3>
            <p className="text-gray-400 text-sm">
             This list is based on user reports. Always do your own research before playing on any casino site. 
             Make sure the site has an official license and a good reputation.
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListReport;
