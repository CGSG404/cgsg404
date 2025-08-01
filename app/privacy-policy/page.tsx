export const metadata = {
  title: "Privacy Policy | CGSG",
  description: "Read the privacy policy for GuruSingapore. Learn how we collect, use, and protect your personal information.",
};
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <main className="relative overflow-hidden flex-1 container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Privacy Policy</h1>
        <p className="text-gray-300 text-sm md:text-base">Last updated: July 1, 2025</p>
        <p className="text-gray-400">
          We value your privacy. This Privacy Policy explains how CasinoGuru Singapore collects, uses, and safeguards your personal information when you visit our site.
          By using the site you agree to the collection and use of information in accordance with this policy.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="text-gray-400">We may collect personal information such as your email address, username, and any other information you voluntarily provide.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Information</h2>
        <p className="text-gray-400">The information we collect is used to improve our services, personalize your experience, and communicate updates or promotions.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
        <p className="text-gray-400">We use cookies to enhance user experience. You can choose to disable cookies through your browser settings.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-400">If you have any questions about this Privacy Policy, please contact us:</p>
        <a href="mailto:support@gurusingapore.com" className="inline-block mt-2">
          <button className="bg-casino-neon-green text-casino-dark font-bold px-6 py-2 rounded hover:bg-casino-neon-green/90 transition">
            Email Support
          </button>
        </a>
      </main>
      <Footer />
    </div>
  );
}
