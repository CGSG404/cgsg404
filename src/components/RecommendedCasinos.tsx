"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const CasinoCard = dynamic(() => import("@/components/CasinoCard"), {
  ssr: false,
});

interface Casino {
  id: number;
  name: string;
  logo: string;
  rating: number;
  safetyIndex: string;
  bonus: string;
  features: string[];
  description: string;
  badges?: string[];
  isNew?: boolean;
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  playUrl: string;
}

export default function RecommendedCasinos() {
  const [casinos, setCasinos] = useState<Casino[]>([]);

  useEffect(() => {
    const fetchCasinos = async () => {
      const { data, error } = await supabase
        .from("casinos")
        .select(
          "id,name,logo,rating,safetyIndex,bonus,features,description,badges,isNew,links,playUrl"
        );
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load casinos", error.message);
        return;
      }
      if (data) {
        // shuffle array then take first 3
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setCasinos(shuffled.slice(0, 3) as unknown as Casino[]);
      }
    };

    fetchCasinos();
  }, []);

  if (casinos.length === 0) return null;

  return (
    <section className="mt-20 container mx-auto px-4" id="recommended-casinos">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
        Recommended Casinos
      </h3>
      <div className="grid gap-6 md:grid-cols-3">
        {casinos.map((casino) => (
          <CasinoCard key={casino.id} casino={casino as any} />
        ))}
      </div>
    </section>
  );
}
