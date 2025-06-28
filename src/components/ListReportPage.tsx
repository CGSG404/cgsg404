import React, { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportCard from '@/components/ReportCard';
import { Card } from '@/components/ui/card';

// Jika Anda punya data asli, import di sini. Jika tidak, gunakan dummy:
import { reports as reportData, ReportData } from '@/data/reportData';

const ListReportPage = () => {
  const [reports, setReports] = useState<ReportData[]>(reportData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? reports.filter((r: ReportData) => r.casinoName.toLowerCase().includes(term)) : reports;
  }, [search, reports]);

  return (
    <div className="min-h-screen bg-casino-dark font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Casino <span className="gradient-text">List Report</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            List of online casinos reported by the community. Check their reputation before you play.
          </p>
        </div>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search casino..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded border border-casino-border-subtle w-full max-w-md"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.length === 0 ? (
            <Card className="bg-casino-card-bg border-casino-border-subtle p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Reports Found</h3>
              <p className="text-gray-400 text-sm">
                No reports found. Try another keyword.
              </p>
            </Card>
          ) : (
            filteredReports.map((report: ReportData, idx: number) => (
              <ReportCard
                key={idx}
                casinoName={report.casinoName}
                reportDate={report.lastReported}
                issue={report.summary}
                isLicensed={report.status === 'Unlicensed' ? false : true}
                reportUrl={report.url}
              />
            ))
          )}
        </div>
        <div className="mt-12">
          <Card className="bg-casino-card-bg border-casino-border-subtle p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Alert!!</h3>
            <p className="text-gray-400 text-sm">
             This list is based on user reports. Always do your own research before playing on any casino site. <br />
             Make sure the site has an official license and a good reputation.
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListReportPage;
