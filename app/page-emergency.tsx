import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casino Singapore | GuruSingapore",
  description: "Find Your Trusted Casino Singapore, Best Event, Information Active, and Forum Report",
};

export default function EmergencyHomePage() {
  return (
    <div className="min-h-screen bg-casino-dark text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-casino-dark via-casino-darker to-casino-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            CGSG Casino Guide
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Your Trusted Casino Singapore Guide
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Find Your Trusted Casino Singapore, Best Event, Information Active, and Forum Report
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-casino-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Casino Reviews</h3>
              <p className="text-gray-400">
                Comprehensive reviews of the best online casinos in Singapore
              </p>
            </div>
            
            <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-casino-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Exclusive Bonuses</h3>
              <p className="text-gray-400">
                Get access to exclusive bonuses and promotions
              </p>
            </div>
            
            <div className="bg-casino-card-bg border border-casino-border-subtle rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-casino-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Safety First</h3>
              <p className="text-gray-400">
                Only licensed and regulated casinos with high safety ratings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="py-16 bg-casino-darker">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Our Site
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a 
              href="/casinos" 
              className="bg-casino-card-bg border border-casino-border-subtle rounded-lg p-4 text-center hover:bg-casino-neon-green/10 transition-colors"
            >
              <div className="text-2xl mb-2">🎰</div>
              <div className="font-semibold">Casinos</div>
            </a>
            
            <a 
              href="/games" 
              className="bg-casino-card-bg border border-casino-border-subtle rounded-lg p-4 text-center hover:bg-casino-neon-green/10 transition-colors"
            >
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-semibold">Games</div>
            </a>
            
            <a 
              href="/news" 
              className="bg-casino-card-bg border border-casino-border-subtle rounded-lg p-4 text-center hover:bg-casino-neon-green/10 transition-colors"
            >
              <div className="text-2xl mb-2">📰</div>
              <div className="font-semibold">News</div>
            </a>
            
            <a 
              href="/reviews" 
              className="bg-casino-card-bg border border-casino-border-subtle rounded-lg p-4 text-center hover:bg-casino-neon-green/10 transition-colors"
            >
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-semibold">Reviews</div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-casino-dark border-t border-casino-border-subtle py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 CGSG Casino Guide. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Emergency Mode - Full functionality will be restored soon.
          </p>
        </div>
      </footer>
    </div>
  );
}
