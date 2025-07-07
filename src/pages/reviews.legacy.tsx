import Head from "next/head";
import dynamic from "next/dynamic";

const ReviewsPage = dynamic(() => import("@/components/ReviewsPage"), { ssr: false });

export default function Reviews() {
  return (
    <>
      <Head>
        <title>Online Casino Reviews | GuruSingapore</title>
        <meta
          name="description"
          content="Explore honest reviews of online casinos in Singapore. Ratings, pros & cons, safety checks, and more."
        />
        <meta
          name="keywords"
          content="Casino Reviews, Trusted Casino Ratings, Online Casino Singapore, Honest Casino Review"
        />
        <meta property="og:title" content="Top Online Casino Reviews" />
        <meta
          property="og:description"
          content="Trusted and detailed reviews of top online casinos to help you choose wisely."
        />
        <meta property="og:url" content="https://gurusingapore.com/reviews" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>

      <ReviewsPage />
    </>
  );
}
