import { Metadata } from 'next';
import ListReportPage from '@/src/components/ListReportPage';

export const metadata: Metadata = {
  title: 'Casino List Report - Community Warnings & Trusted Insights | CGSG',
  description: 'List of online casinos reported by the community. Check their reputation before you play. Stay safe with our up-to-date warnings and trusted user insights.',
  keywords: 'casino report, scam casino, blacklist casino, casino complaint, fraud report, casino warning',
  openGraph: {
    title: 'Casino List Report - Community Warnings & Trusted Insights',
    description: 'List of online casinos reported by the community. Check their reputation before you play.',
    type: 'website',
    url: 'https://gurusingapore.com/list-report',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casino List Report - Community Warnings & Trusted Insights',
    description: 'List of online casinos reported by the community. Check their reputation before you play.',
  },
  alternates: {
    canonical: 'https://gurusingapore.com/list-report',
  },
};

export default function ListReportPageRoute() {
  return <ListReportPage />;
}
