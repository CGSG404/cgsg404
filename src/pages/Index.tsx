import Head from "next/head";
import dynamic from "next/dynamic";

const IndexPage = dynamic(() => import("@/components/IndexPage"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Casino Singapore | GuruSingapore</title>
        <meta
          name="description"
          content="Find Your Trusted Casino Singapore, Best Event, Information Active, and Forum Report"
        />
        <meta
          name="keywords"
          content="Casino, Online Casino, CGSG, Guru Singapore, GuruSingapore, Casino Guru, SG, Singapore, Online SG, Games, Review, Rating, Best Platform, Guru Academy"
        />
        <meta property="og:title" content="Your Trusted Casino Guide" />
        <meta property="og:description" content="Find Your Trusted Casino Singapore."/>
        <meta property="og:url" content="https://gurusingapore.com" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* konten utama (masih client-side) */}
      <IndexPage />
    </>
  );
}
