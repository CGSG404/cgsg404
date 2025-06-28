
import dynamic from "next/dynamic";
const CasinosPage = dynamic(() => import("@/components/CasinosPage"), { ssr: false });
export default CasinosPage;
