import { Metadata } from 'next';
import CasinoReportsPage from '@/components/CasinoReportsPage';

export const metadata: Metadata = {
  title: 'Casino Reports - CGSG404 | Community Casino Safety Reports',
  description: 'Browse community-reported casino safety issues, scam alerts, and unlicensed operators. Stay informed about problematic gambling sites in Singapore.',
  keywords: 'casino reports, scam casinos, unlicensed gambling, casino safety, Singapore gambling',
  openGraph: {
    title: 'Casino Reports - CGSG404',
    description: 'Community-driven casino safety reports and scam alerts',
    type: 'website',
    url: 'https://gurusingapore.com/list-report',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casino Reports - CGSG404',
    description: 'Community-driven casino safety reports and scam alerts',
  },
};

export default function ListReportPage() {
  return <CasinoReportsPage />;
}
