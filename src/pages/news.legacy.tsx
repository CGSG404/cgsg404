import dynamic from "next/dynamic";

const NewsPage = dynamic(() => import("@/components/NewsPage"), { ssr: false });

export default NewsPage;
