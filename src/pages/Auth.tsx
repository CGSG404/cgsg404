import dynamic from "next/dynamic";
const AuthPage = dynamic(() => import("@/components/AuthPage"), { ssr: false });
export default AuthPage;
