export type Review = {
  name: string;
  logo: string;
  rating: number;
  bonus: string;
  slug: string;
  description: string;
  games: string[];
  paymentMethods: string[];
  features: string[];
  safetyIndex: 'Low' | 'Medium' | 'High' | 'Very High';
  isNew?: boolean;
  badges?: string[];
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  playUrl: string;
};
