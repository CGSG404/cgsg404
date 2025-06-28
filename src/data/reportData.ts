// Definisikan tipe data untuk setiap laporan
export interface ReportData {
    id: string;
    casinoName: string;
    status: 'Unlicensed' | 'Scam Indicated' | 'Many Users Reported';
    lastReported: string;
    summary: string;
    url: string; // <-- Di sini Anda bisa meletakkan URL manual
  }
  
  // Ini adalah "database" lokal Anda. 
  // Atur nama kasino dan URL-nya di sini.
  export const reports: ReportData[] = [
    {
      id: '1',
      casinoName: 'Casino Phantom',
      status: 'Unlicensed',
      lastReported: '2025-06-25',
      summary: 'Beroperasi tanpa lisensi resmi dan tidak membayar kemenangan member.',
      url: 'https://example.com/casino-phantom'
    },
    {
      id: '2',
      casinoName: 'LuckyScam',
      status: 'Scam Indicated',
      lastReported: '2025-06-20',
      summary: 'Banyak user melaporkan deposit hilang dan tidak bisa withdraw.',
      url: 'https://example.com/luckyscam'
    },
    {
      id: '3',
      casinoName: 'FakeJackpot',
      status: 'Many Users Reported',
      lastReported: '2025-06-18',
      summary: 'Penipuan jackpot palsu dan manipulasi odds.',
      url: 'https://example.com/fakejackpot'
    },
    {
      id: '4',
      casinoName: 'No Report yet',
      status: 'Unlicensed',
      lastReported: 'No report yet',
      summary: 'No Report yet',
      url: '#'
    }
  ];