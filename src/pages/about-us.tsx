import Link from 'next/link';

const AboutUs = () => (
  <section className="py-16">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-white">About Us</h1>
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
      <p className="text-gray-300 mb-6">Have questions or suggestions? Reach out at <a className="text-casino-neon-green underline" href="mailto:support@gurusingapore.com">support@gurusingapore.com</a>.</p>

      <Link href="/" className="text-casino-neon-green hover:underline">Back to Home</Link>
    </div>
  </section>
);

export default AboutUs;
