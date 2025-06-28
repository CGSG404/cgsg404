import dynamic from "next/dynamic";
const NotFoundPage = dynamic(() => import("../components/NotFoundPage"), { ssr: false });
export default NotFoundPage;
