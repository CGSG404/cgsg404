
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import ReportCard from '@/components/ReportCard';

interface ReportData {
  id: string;
  casinoName: string;
  status: 'Tidak Terlisensi' | 'Terindikasi Scam' | 'Dilaporkan Banyak Pengguna';
  lastReported: string;
  summary: string;
}

const ListReport = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // <!-- placeholder: fetch data dari Supabase (report list) -->
    // Simulate loading data - replace with actual Supabase query
    const mockData: ReportData[] = [
      {
        id: '1',
        casinoName: 'Casino123.win',
        status: 'Tidak Terlisensi',
        lastReported: '22 Juni 2025',
        summary: 'Tidak bisa menarik dana pengguna setelah menang'
      },
      {
        id: '2',
        casinoName: 'FakeSpin88.com',
        status: 'Terindikasi Scam',
        lastReported: '21 Juni 2025',
        summary: 'Website menghilang setelah menerima deposit besar dari pengguna'
      },
      {
        id: '3',
        casinoName: 'BadLuck Casino',
        status: 'Dilaporkan Banyak Pengguna',
        lastReported: '20 Juni 2025',
        summary: 'Customer service tidak responsif, proses withdrawal sangat lambat'
      },
      {
        id: '4',
        casinoName: 'ScamBet.net',
        status: 'Terindikasi Scam',
        lastReported: '19 Juni 2025',
        summary: 'Meminta verifikasi berulang-ulang untuk menghindari pembayaran'
      },
      {
        id: '5',
        casinoName: 'UnlicensedGames.io',
        status: 'Tidak Terlisensi',
        lastReported: '18 Juni 2025',
        summary: 'Tidak memiliki lisensi resmi dan beroperasi tanpa izin'
      }
    ];

    setTimeout(() => {
      setReports(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tidak Terlisensi':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Terindikasi Scam':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Dilaporkan Banyak Pengguna':
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
          <h1 className="text-4xl font-bold mb-4">
            List Report – <span className="gradient-text text-red-400">Bad List</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Daftar situs kasino online yang dilaporkan oleh pengguna karena tidak memiliki lisensi resmi, 
            terindikasi scam, atau pelayanan buruk.
          </p>
        </div>

        <div className="space-y-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              casinoName={report.casinoName}
              reportDate={report.lastReported}
              issue={report.summary}
              isLicensed={report.status === 'Tidak Terlisensi' ? false : true}
              className="w-full"
            />
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <Card className="bg-casino-card-bg border-casino-border-subtle p-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Laporan</h3>
              <p className="text-gray-400">
                Saat ini tidak ada situs casino yang dilaporkan bermasalah.
              </p>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-casino-card-bg border-casino-border-subtle p-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Peringatan</h3>
            <p className="text-gray-400 text-sm">
              Daftar ini berdasarkan laporan pengguna. Selalu lakukan riset sendiri sebelum bermain di situs casino manapun. 
              Pastikan situs memiliki lisensi resmi dan reputasi yang baik.
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListReport;
