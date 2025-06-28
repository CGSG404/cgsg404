
import dynamic from "next/dynamic";
const GuidePage = dynamic(() => import("../components/GuidePage"), { ssr: false });
export default GuidePage;
