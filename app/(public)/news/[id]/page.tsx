import { Metadata } from "next";
import NewsDetailPage from "@/components/NewsDetailPage";

export const revalidate = 600;

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => ({
  title: `News ${params.id} | CGSG`,
});

export default function NewsDetail() {
  return <NewsDetailPage />;
}
