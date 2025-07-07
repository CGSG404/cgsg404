import { Metadata } from "next";
import GamesPage from "@/components/GamesPage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Games | CGSG",
  description: "Browse popular casino game titles and guides.",
};

export default function Games() {
  return <GamesPage />;
}
