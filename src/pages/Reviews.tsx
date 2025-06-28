import dynamic from "next/dynamic";

const ReviewsPage = dynamic(() => import("@/components/ReviewsPage"), { ssr: false });

export default ReviewsPage;
