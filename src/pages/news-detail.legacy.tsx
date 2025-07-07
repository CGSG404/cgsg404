import dynamic from 'next/dynamic';

const NewsDetailPage = dynamic(() => import('@/components/NewsDetailPage'), { ssr: false });

export default NewsDetailPage;
