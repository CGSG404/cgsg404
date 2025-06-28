import dynamic from "next/dynamic";
const IndexPage = dynamic(() => import("@/components/IndexPage"), { ssr: false });
export default IndexPage;

