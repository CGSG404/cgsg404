import IndexPage from "@/src/components/IndexPage";
import MaintenanceWrapper from "@/src/components/MaintenanceWrapper";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import { Metadata } from "next";
import { organizationSchema, websiteSchema } from "@/src/lib/metadata";

export const metadata: Metadata = {
  title: "Best Online Casinos Singapore 2025 - Trusted Reviews & Bonuses",
  description: "Discover the top online casinos in Singapore with expert reviews, exclusive welcome bonuses up to $2000, and real player ratings. 100% safe and licensed casinos only.",
  keywords: ["online casino Singapore", "best casino Singapore 2025", "casino reviews", "casino bonuses", "trusted casinos", "safe gambling Singapore", "casino games", "live casino Singapore"],
  openGraph: {
    title: "Best Online Casinos Singapore 2025 - CasinoGuru SG",
    description: "Find trusted online casinos in Singapore with exclusive bonuses, expert reviews, and 24/7 support. Join 10,000+ players winning daily!",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "CasinoGuru Singapore - Your Trusted Casino Guide"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Online Casinos Singapore 2025",
    description: "Expert casino reviews, exclusive bonuses up to $2000, and verified safe casinos. Join the winning community!",
  },
  alternates: {
    canonical: "https://www.gurusingapore.com"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, websiteSchema])
        }}
      />
      <ErrorBoundary>
        <MaintenanceWrapper>
          <IndexPage />
        </MaintenanceWrapper>
      </ErrorBoundary>
    </>
  );
}
