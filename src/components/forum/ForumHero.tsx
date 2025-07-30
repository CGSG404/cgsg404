import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Trophy, ArrowRight } from 'lucide-react';

const ForumHero = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-8 lg:pb-12 bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff9a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-2xl text-center lg:text-left"
          >
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-400">
              <Link href="/" className="hover:text-casino-neon-green transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-casino-neon-green font-medium">Forum</span>
            </nav>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white mb-6">
              Casino Community{' '}
              <span className="bg-gradient-to-r from-casino-neon-green via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Forum
              </span>
            </h1>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <Image
                src="/founder.png"
                alt="Author avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-casino-neon-green/30"
              />
              <div className="text-left">
                <div className="font-semibold text-white">GuruSG Team</div>
                <div className="text-sm text-gray-400">Community Moderators</div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Join thousands of players discussing strategies, sharing experiences, and helping each other win big!
              Connect, ask questions, and be part of our thriving CGSG community.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link href="/auth" className="inline-flex">
                <button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-casino-neon-green/25 flex items-center gap-2 group w-full sm:w-auto justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Join the Discussion</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                className="border-2 border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green/10 font-semibold px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center gap-2 justify-center group w-full sm:w-auto"
                onClick={() => {
                  const section = document.querySelector('[data-section="forum-content"]');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Browse Topics</span>
              </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4 text-casino-neon-green" />
                <span>2,847+ Members</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MessageCircle className="w-4 h-4 text-casino-neon-green" />
                <span>15,632+ Posts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy className="w-4 h-4 text-casino-neon-green" />
                <span>Active Daily</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex-shrink-0"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Static Glow Effect */}
              <div className="absolute inset-0 bg-casino-neon-green/20 rounded-full blur-3xl" />
              <Image
                src="/cgsg-logos.png"
                alt="CGSG Community"
                fill
                className="object-contain relative z-10"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForumHero;