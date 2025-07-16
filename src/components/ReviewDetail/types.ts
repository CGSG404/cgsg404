// Tipe baru untuk setiap artikel atau blok konten dalam sebuah ulasan
export type Article = {
  slug: string;
  title: string;
  summary: string;
  content: string; // Bisa berisi markdown atau teks biasa
  imageUrl?: string;
};

export type Review = {
  name: string;
  logo: string;
  rating: number;
  bonus: string;
  slug: string;
  description: string; // Tetap ada untuk metadata & deskripsi singkat
  articles?: Article[]; // Daftar artikel untuk konten detail
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
  visitedCount?: number;
  featureBanner?: string;
};
