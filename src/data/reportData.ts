// Definisikan tipe data untuk setiap laporan (sesuai dengan ReportCard interface)
export interface ReportData {
    id: string;
    casinoName: string;
    status: 'Unlicensed' | 'Scam Indicated' | 'Many Users Reported';
    lastReported: string;
    issue: string; // Changed from 'summary' to 'issue' to match ReportCard
    url: string;
    reporterEmail?: string; // Optional field for admin management
  }

// Interface untuk data dari database (Supabase) - matches actual database schema
export interface DatabaseReportData {
    id: number;
    casino_name: string;
    status: 'Unlicensed' | 'Scam Indicated' | 'Many Users Reported';
    last_reported: string;
    summary: string; // Database uses 'summary' field
    url: string;
    created_at: string;
    updated_at: string;
  }

// Function to transform database data to frontend format
export function transformDatabaseReport(dbReport: DatabaseReportData): ReportData {
    return {
        id: dbReport.id.toString(),
        casinoName: dbReport.casino_name,
        status: dbReport.status,
        lastReported: dbReport.last_reported,
        issue: dbReport.summary, // Database uses 'summary' field, frontend uses 'issue'
        url: dbReport.url,
        reporterEmail: '' // Database doesn't store reporter email
    };
}
  
  // Contoh data card untuk halaman list report
  export const reports: ReportData[] = [
    {
      id: '1',
      casinoName: 'LuckyWin88 Casino',
      status: 'Unlicensed',
      lastReported: '2025-01-15',
      issue: 'Casino beroperasi tanpa lisensi resmi. Banyak pemain melaporkan kesulitan penarikan dana dan layanan pelanggan yang tidak responsif. Situs web sering mengalami downtime.',
      url: 'https://example.com/luckywin88-report',
      reporterEmail: 'user1@example.com'
    },
    {
      id: '2',
      casinoName: 'GoldenBet777',
      status: 'Scam Indicated',
      lastReported: '2025-01-12',
      issue: 'Dilaporkan karena permainan yang dimanipulasi dan bonus dengan syarat yang tidak masuk akal. Beberapa pemain kehilangan deposit tanpa bisa bermain.',
      url: 'https://example.com/goldenbet777-report',
      reporterEmail: 'user2@example.com'
    },
    {
      id: '3',
      casinoName: 'MegaJackpot Casino',
      status: 'Many Users Reported',
      lastReported: '2025-01-10',
      issue: 'Konsisten dilaporkan karena tidak membayar kemenangan. Pemain yang menang besar mengalami penangguhan akun tanpa alasan yang jelas.',
      url: 'https://example.com/megajackpot-report',
      reporterEmail: 'user3@example.com'
    },
    {
      id: '4',
      casinoName: 'RoyalSpin Palace',
      status: 'Unlicensed',
      lastReported: '2025-01-08',
      issue: 'Menggunakan informasi lisensi palsu dan dilaporkan karena pencurian identitas. Data pribadi dan finansial pemain berisiko.',
      url: 'https://example.com/royalspin-report',
      reporterEmail: 'user4@example.com'
    },
    {
      id: '5',
      casinoName: 'DiamondBet Club',
      status: 'Scam Indicated',
      lastReported: '2025-01-05',
      issue: 'Taktik pemasaran agresif dan biaya tersembunyi. Pemain dikenakan biaya tak terduga dan bonus dengan syarat yang mustahil dipenuhi.',
      url: 'https://example.com/diamondbet-report',
      reporterEmail: 'user5@example.com'
    },
    {
      id: '6',
      casinoName: 'SuperLucky Casino',
      status: 'Many Users Reported',
      lastReported: '2025-01-03',
      issue: 'Syarat dan ketentuan yang membingungkan dan sering berubah. Proses penarikan sengaja dipersulit dan layanan pelanggan memberikan informasi menyesatkan.',
      url: 'https://example.com/superlucky-report',
      reporterEmail: 'user6@example.com'
    },
    {
      id: '7',
      casinoName: 'CrystalBet Gaming',
      status: 'Unlicensed',
      lastReported: '2025-01-01',
      issue: 'Beroperasi tanpa lisensi yang valid. Pemain melaporkan masalah dengan verifikasi akun dan penundaan pembayaran yang tidak wajar.',
      url: 'https://example.com/crystalbet-report',
      reporterEmail: 'user7@example.com'
    },
    {
      id: '8',
      casinoName: 'EliteWin Casino',
      status: 'Scam Indicated',
      lastReported: '2024-12-28',
      issue: 'Dilaporkan karena permainan slot yang dimanipulasi dan RTP yang tidak sesuai standar. Banyak pemain mengalami kerugian yang tidak wajar.',
      url: 'https://example.com/elitewin-report',
      reporterEmail: 'user8@example.com'
    }
  ];