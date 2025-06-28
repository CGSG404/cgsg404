
import dynamic from "next/dynamic";
const BonusesPage = dynamic(() => import("@/components/BonusesPage"), { ssr: false });
export default BonusesPage;
