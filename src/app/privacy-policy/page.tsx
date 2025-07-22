'use client';

import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-casino-neon-green/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-casino-neon-green hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-casino-neon-green/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-casino-neon-green" />
            </div>
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-800/30 rounded-xl border border-casino-neon-green/20 p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Information We Collect</h2>
            <p className="text-gray-300 mb-6">
              CGSG Casino Guide is committed to protecting your privacy. We collect minimal information necessary to provide our casino review and guide services.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">How We Use Your Information</h2>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• To provide personalized casino recommendations</li>
              <li>• To improve our review and rating system</li>
              <li>• To send you updates about new casino reviews (with your consent)</li>
              <li>• To ensure the security and integrity of our platform</li>
            </ul>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Data Protection</h2>
            <p className="text-gray-300 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Third-Party Services</h2>
            <p className="text-gray-300 mb-6">
              We may use third-party services for analytics and authentication. These services have their own privacy policies governing the use of your information.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us through our support channels.
            </p>

            <div className="mt-8 pt-6 border-t border-casino-neon-green/20">
              <p className="text-sm text-gray-500">
                Last updated: December 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
