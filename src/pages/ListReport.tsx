import Head from "next/head";
import dynamic from "next/dynamic";

const ListReportPage = dynamic(() => import("@/components/ListReportPage"), { ssr: false });

export default function ListPage() {
  return (
    <>
      <Head>
        <title>Casino Reports & Rankings | GuruSingapore</title>
        <meta
          name="description"
          content="Discover top-ranked online casinos with in-depth reviews, safety analysis, and bonus evaluations."
        />
        <meta
          name="keywords"
          content="Casino Report, Online Casino Rankings, Casino Safety, Trusted Reviews, Bonus Reports"
        />
        <meta property="og:title" content="Online Casino Reports" />
        <meta
          property="og:description"
          content="Detailed reports and trusted rankings for the best online casinos."
        />
        <meta property="og:url" content="https://gurusingapore.com/list" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>

      <ListReportPage />
    </>
  );
}
