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
      casinoName: 'No Report yet',
      status: 'Unlicensed',
      lastReported: 'No report yet',
      summary: 'No Report yet',
      url: '#' // <-- Letakkan URL di sini
    }
  ];