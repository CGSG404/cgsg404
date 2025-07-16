import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBlurBG from "@/components/AnimatedBlurBG";

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen flex flex-col text-white">
      <Navbar />
      <main className="relative overflow-hidden flex-1 container mx-auto px-4 py-16 space-y-6">
        <AnimatedBlurBG />
        <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Terms of Service</h1>
        <p className="text-gray-300 text-sm md:text-base">Last updated: July 1, 2025</p>
        <p className="text-gray-400">
          By accessing or using CasinoGuru Singapore, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-400">Your use of the Site signifies your acceptance of these Terms and any future modifications.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
        <p className="text-gray-400">You must be at least 18 years old or the legal age for gambling in your jurisdiction, whichever is higher.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Responsible Gambling</h2>
        <p className="text-gray-400">We encourage responsible gaming. If you feel you have a gambling problem, seek professional help.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p className="text-gray-400">All content on this Site is owned by or licensed to CGSG and protected by applicable laws.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
        <p className="text-gray-400">CGSG will not be liable for any indirect, incidental, or consequential damages arising from your use of the Site.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
        <p className="text-gray-400">We reserve the right to update these Terms at any time. Continued use of the Site constitutes acceptance of the new Terms.</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="text-gray-400">Questions about these Terms? Email us at support@gurusingapore.com.</p>
      </main>
      <Footer />
    </div>
  );
}
