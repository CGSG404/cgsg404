import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportCard from '@/components/ReportCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Card } from '@/components/ui/card';
import ReportDialog from '@/components/ReportDialog';
import { Button } from '@/components/ui/button';
import BackToTop from '@/components/BackToTop';

// Jika Anda punya data asli, import di sini. Jika tidak, gunakan dummy:
import { reports as reportData, ReportData } from '@/data/reportData';

const ListReportPage = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  // toggle buttons based on scroll
  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [reports, setReports] = useState<ReportData[]>(reportData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? reports.filter((r: ReportData) => r.casinoName.toLowerCase().includes(term)) : reports;
  }, [search, reports]);

  // Split reports into chunks of 5 for mobile slider
  const chunkedReports = useMemo(() => {
    const result: ReportData[][] = [];
    for (let i = 0; i < filteredReports.length; i += 5) {
      result.push(filteredReports.slice(i, i + 5));
    }
    return result;
  }, [filteredReports]);

  return (
    <div className="min-h-screen bg-casino-dark font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Casino <span className="gradient-text">List Report</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            List of online casinos reported by the community. Check their reputation before you play.
          </p>
        </div>
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for a casino report by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 pl-16 text-lg bg-casino-card-bg border border-casino-border-subtle rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-casino-neon-green/50 transition-all duration-300"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>
        {/* Mobile Slider */}
        <div className="sm:hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            className="pb-8"
          >
            {chunkedReports.map((group, idx) => (
              <SwiperSlide key={idx} className="pb-4">
                <div className="flex flex-col gap-4">
                  {group.map((report) => (
                    <ReportCard
                      key={report.id}
                      casinoName={report.casinoName}
                      reportDate={report.lastReported}
                      issue={report.summary}
                      isLicensed={report.status !== 'Unlicensed'}
                      reportUrl={report.url}
                      className="h-full"
                    />
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      {/* Global Report Dialog */}
      <ReportDialog open={reportOpen} onOpenChange={setReportOpen} casinoName="" />
      {/* Floating Buttons */}
      {showBackTop ? (
        <BackToTop />
      ) : (
        <Button
          onClick={() => setReportOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 shadow-lg px-5 py-3 rounded-full"
        >
          Report an Issue
        </Button>
      )}
    </div>
  );
};

export default ListReportPage;
