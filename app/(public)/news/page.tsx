import { Metadata } from "next";
import NewsPage from "@/components/NewsPage";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Casino News | CGSG",
  description: "Latest updates and articles from CGSG and the gambling industry.",
};

export default function News() {
  return <NewsPage />;
}
