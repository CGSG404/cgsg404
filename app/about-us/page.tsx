import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

// export const revalidate = 86400; // revalidate daily



export const metadata: Metadata = {
  title: "About Us | CGSG",
  description: "Learn about CasinoGuruSG (CGSG), our mission, and our commitment to providing transparent and accurate casino reviews.",
};

export default function AboutUsPage() {
  const team = [
    {
      name: "Founder of Website",
      image: "/founder.png",
      alt: "Founder photo",
    },
    {
      name: "Guru Singapore",
      image: "/favicon.ico",
      alt: "CGSG Logo",
    },
    {
      name: "Co-Founder of Group",
      image: "/co-founder.png",
      alt: "Co-Founder photo",
    },
  ];
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Main title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 uppercase bg-gradient-to-r from-casino-neon-green via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          About Us
        </h1>
        {/* Banner image */}
        <div className="mb-12">
          <Image
            src="/about-us.png"
            alt="CGSG banner"
            width={1200}
            height={400}
            className="w-full rounded-lg object-cover shadow-xl"
            priority
          />
        </div>
        {/* Team avatars */}
        <div className="mb-10 grid grid-cols-3 gap-6 place-items-center">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <Image
                src={member.image}
                alt={member.alt}
                width={160}
                height={160}
                className={`h-24 w-24 md:h-40 md:w-40 object-cover shadow-lg ${member.name !== 'Guru Singapore' ? 'rounded-full ring-4 ring-casino-neon-green/60' : ''}` }
              />
              <span className="mt-3 text-gray-200 font-medium">{member.name}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          CasinoGuruSG (CGSG) was founded with a single mission: to empower players with transparent,
          accurate, and up-to-date information about online casinos. We review platforms, test their fairness,
          and track player feedback so you can play with confidence.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          Our editorial team is composed of passionate gamblers, data analysts, and security experts who
          evaluate each casino across dozens of criteria—from licensing and RNG certification to payout speed
          and responsible gaming tools.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          CGSG operates independently. We may receive affiliate commissions, but this never influences our
          ratings. Integrity and player safety are always our top priorities.
        </p>
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Contact</h2>
        <p className="text-gray-300 mb-6">
          Have questions or suggestions? Reach out at
          <a className="text-casino-neon-green underline" href="mailto:support@gurusingapore.com">
            support@gurusingapore.com
          </a>.
        </p>
        <Link href="/" className="text-casino-neon-green hover:underline">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
