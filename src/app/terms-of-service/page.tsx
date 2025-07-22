'use client';

import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
              <FileText className="w-4 h-4 text-casino-neon-green" />
            </div>
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-800/30 rounded-xl border border-casino-neon-green/20 p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 mb-6">
              By accessing and using CGSG Casino Guide, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Use License</h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily access CGSG Casino Guide for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for any commercial purpose or for any public display</li>
              <li>• Attempt to reverse engineer any software contained on the website</li>
              <li>• Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-6">
              The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, CGSG Casino Guide excludes all representations, warranties, conditions and terms.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Responsible Gaming</h2>
            <p className="text-gray-300 mb-6">
              CGSG Casino Guide promotes responsible gaming. We provide information and reviews for educational purposes. Please gamble responsibly and within your means.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Limitations</h2>
            <p className="text-gray-300 mb-6">
              In no event shall CGSG Casino Guide or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website.
            </p>

            <h2 className="text-xl font-semibold text-casino-neon-green mb-4">Governing Law</h2>
            <p className="text-gray-300">
              These terms and conditions are governed by and construed in accordance with applicable laws and you irrevocably submit to the exclusive jurisdiction of the courts.
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
