import { Link } from 'react-router-dom';
import { Star, Shield, Users, Gift } from 'lucide-react';
import CountUp from 'react-countup';
import { useState } from 'react';

const Footer = () => {
  const [openModal, setOpenModal] = useState<null | 'privacy' | 'terms' | 'contact'>(null);

  const footerSections = [
    {
      title: 'Casino Reviews',
      links: [
        { name: 'Best Casinos', href: '/casinos' },
        { name: 'New Casinos', href: '/casinos/new' },
        { name: 'Mobile Casinos', href: '/casinos/mobile' },
        { name: 'Live Dealer', href: '/games/live' },
      ]
    },
    {
      title: 'Bonuses & Offers',
      links: [
        { name: 'Welcome Bonuses', href: '/bonuses/welcome' },
        { name: 'No Deposit', href: '/bonuses/no-deposit' },
        { name: 'Free Spins', href: '/bonuses/free-spins' },
        { name: 'Cashback', href: '/bonuses/cashback' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Forum', href: '/forum' },
        { name: 'User Reviews', href: '/reviews' },
        { name: 'Complaints', href: '/complaints' },
        { name: 'Success Stories', href: '/stories' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Gambling Guide', href: '/guide' },
        { name: 'Responsible Gaming', href: '/responsible' },
        { name: 'News', href: '/news' },
        { name: 'About Us', href: '/about' },
      ]
    }
  ];

  return (
    <footer className="bg-casino-dark-lighter border-t border-casino-border-subtle">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-neon-gradient rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-casino-dark" />
              </div>
              <span className="text-xl font-bold gradient-text">CasinoGuruSG</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted source for honest casino reviews, safety ratings, and expert gambling advice.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-casino-neon-green text-sm">
                <Shield className="w-4 h-4 mr-1" />
                <span>Verified Casinos</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-casino-neon-green transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-casino-border-subtle pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-casino-neon-green mb-2" />
              <div className="text-lg font-bold text-white">
                <CountUp end={2500} duration={1.5} separator="," />+
              </div>
              <div className="text-gray-400 text-sm">Verified Casinos</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-lg font-bold text-white">
                <CountUp end={1200000} duration={1.5} separator="," />+
              </div>
              <div className="text-gray-400 text-sm">Community Members</div>
            </div>
            <div className="flex flex-col items-center">
              <Gift className="w-8 h-8 text-casino-neon-purple mb-2" />
              <div className="text-lg font-bold text-white">
                <CountUp end={850} duration={1.5} separator="," />+
              </div>
              <div className="text-gray-400 text-sm">Active Bonuses</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-yellow-400 mb-2" />
              <div className="text-lg font-bold text-white">
                <CountUp end={98} duration={1.5} />%
              </div>
              <div className="text-gray-400 text-sm">Trust Score</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-casino-border-subtle pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 CGSG. All rights reserved. | CasinoGuru Singapore. | Play Responsibly.
          </div>
          <div className="flex space-x-6 text-sm">
            <button
              className="text-gray-400 hover:text-casino-neon-green transition-colors"
              onClick={() => setOpenModal('privacy')}
            >
              Privacy Policy
            </button>
            <button
              className="text-gray-400 hover:text-casino-neon-green transition-colors"
              onClick={() => setOpenModal('terms')}
            >
              Terms of Service
            </button>
            <a
              href="https://t.me/ysfcreatorr" // ganti dengan link kontak Anda
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-casino-neon-green transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-casino-card-bg rounded-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setOpenModal(null)}
            >
              ✕
            </button>
            {openModal === 'privacy' && (
              <>
                <h2 className="text-xl font-bold mb-4 text-white">Privacy Policy</h2>
                <p className="text-gray-300 text-sm">Last Updated: June 22, 2025
                We value your privacy. This policy outlines how we collect, use, and protect your information.</p>
                <p className="text-yellow-300 text-sm">Writed By CGSG x YS.</p>
              </>
            )}
            {openModal === 'terms' && (
              <>
                <h2 className="text-xl font-bold mb-4 text-white">Terms of Service</h2>
                <p className="text-gray-300 text-sm">Last Updated: June 22, 2025
By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using any features on this platform.</p>
                <p className="text-yellow-300 text-sm">Writed By CGSG x YS.</p>
              </>
            )}
            {openModal === 'contact' && (
              <>
                <h2 className="text-xl font-bold mb-4 text-white">Contact</h2>
                <p className="text-gray-300 text-sm">Informasi kontak Anda di sini...</p>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
