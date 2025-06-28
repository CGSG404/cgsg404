// Dynamic import for client-only ListReportPage (SSR disabled)
import dynamic from "next/dynamic";
const ListReportPage = dynamic(() => import("@/components/ListReportPage"), { ssr: false });
export default ListReportPage;

// If alias '@' is not supported, revert to: '../components/ListReportPage'
