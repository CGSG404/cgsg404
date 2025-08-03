import IndexPage from "@/src/components/IndexPage";
import MaintenanceWrapper from "@/src/components/MaintenanceWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casino Singapore | GuruSingapore",
  description: "Find Your Trusted Casino Singapore, Best Event, Information Active, and Forum Report",
};

export default function Home() {
  return (
    <MaintenanceWrapper>
      <IndexPage />
    </MaintenanceWrapper>
  );
}
