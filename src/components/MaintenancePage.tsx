'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Clock, 
  ArrowLeft, 
  Home,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface MaintenancePageProps {
  message?: string | null;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ 
  message,
  showBackButton = true,
  showHomeButton = true
}) => {
  const defaultMessage = "This page is currently under maintenance. Please check back later.";
  const displayMessage = message || defaultMessage;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center border border-orange-500/30">
            <Wrench className="w-16 h-16 text-orange-400 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Under Maintenance
        </h1>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-orange-400" />
          <p className="text-orange-400 font-medium">
            Temporarily Unavailable
          </p>
        </div>

        {/* Message */}
        <div className="bg-casino-darker/50 border border-orange-500/20 rounded-xl p-6 mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            {displayMessage}
          </p>
        </div>

        {/* Additional Info */}
        <div className="bg-casino-darker/30 border border-casino-border-subtle/20 rounded-lg p-4 mb-8">
          <p className="text-gray-400 text-sm">
            We're working hard to improve your experience. This maintenance is temporary and we'll be back online soon.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showHomeButton && (
            <Link href="/">
              <button className="w-full sm:w-auto bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </Link>
          )}

          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-casino-darker border border-casino-border-subtle hover:bg-casino-darker/80 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-casino-border-subtle/20">
          <p className="text-gray-500 text-sm">
            If you continue to see this message, please contact our support team.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/contact" className="text-casino-neon-green hover:text-casino-neon-green/80 text-sm transition-colors">
              Contact Support
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/status" className="text-casino-neon-green hover:text-casino-neon-green/80 text-sm transition-colors">
              System Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
