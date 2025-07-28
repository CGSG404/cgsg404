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
      casinoName: 'ScamCasino Example',
      status: 'Unlicensed',
      lastReported: '2024-12-15',
      summary: 'Multiple users reported withdrawal issues. Casino operates without proper license and has been unresponsive to customer complaints. Users report delayed payments and account restrictions without valid reasons.',
      url: '#'
    },
    {
      id: '2',
      casinoName: 'FakeBet Casino',
      status: 'Scam Indicated',
      lastReported: '2024-12-10',
      summary: 'Reported for rigged games and unfair terms. Several players have complained about manipulated slot machines and impossible bonus wagering requirements. Customer support is non-existent.',
      url: '#'
    },
    {
      id: '3',
      casinoName: 'NoPayCasino',
      status: 'Many Users Reported',
      lastReported: '2024-12-08',
      summary: 'Consistent reports of non-payment of winnings. Users report that after winning significant amounts, their accounts are suspended or closed without explanation. Withdrawal requests are ignored.',
      url: '#'
    },
    {
      id: '4',
      casinoName: 'FraudGaming Site',
      status: 'Unlicensed',
      lastReported: '2024-12-05',
      summary: 'Operating without valid gambling license. Site uses fake licensing information and has been reported for identity theft. Users personal and financial information may be at risk.',
      url: '#'
    },
    {
      id: '5',
      casinoName: 'BadLuck Casino',
      status: 'Scam Indicated',
      lastReported: '2024-12-01',
      summary: 'Reported for aggressive marketing tactics and hidden fees. Users are charged unexpected fees and bonuses come with impossible terms. Multiple complaints about unauthorized charges.',
      url: '#'
    },
    {
      id: '6',
      casinoName: 'TrickyCasino',
      status: 'Many Users Reported',
      lastReported: '2024-11-28',
      summary: 'Users report confusing terms and conditions that change frequently. Withdrawal processes are deliberately complicated and customer service provides misleading information.',
      url: '#'
    }
  ];