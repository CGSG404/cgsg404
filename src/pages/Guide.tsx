import Head from "next/head";
import dynamic from "next/dynamic";

const GuidePage = dynamic(() => import("@/components/GuidePage"), { ssr: false });

export default function Guide() {
  return (
    <>
      <Head>
        <title>Online Casino Guide | GuruSingapore</title>
        <meta
          name="description"
          content="A complete and trusted guide to understanding online casinos in Singapore."
        />
        <meta
          name="keywords"
          content="Casino Guide, Online Casino Guide, Gambling Tips, Casino Singapore, GuruSingapore"
        />
        <meta property="og:title" content="Online Casino Guide Singapore" />
        <meta
          property="og:description"
          content="Explore the best online casino guides and expert advice in Singapore."
        />
        <meta property="og:url" content="https://gurusingapore.com/guide" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>

      <GuidePage />
    </>
  );
}
