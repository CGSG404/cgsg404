import dynamic from "next/dynamic";
const AuthCallback = dynamic(() => import("../components/_AuthCallbackClient"), { ssr: false });
export default AuthCallback;
