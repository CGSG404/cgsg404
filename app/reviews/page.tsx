import { Metadata } from 'next';
import MaintenanceWrapper from '@/src/components/MaintenanceWrapper';
import ReviewsClient from './ReviewsClient';

// export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Reviews | CGSG',
  description: 'Read detailed reviews for casinos and games.',
};

export default function ReviewsPage() {
  return (
    <MaintenanceWrapper>
      <ReviewsClient />
    </MaintenanceWrapper>
  );
}
