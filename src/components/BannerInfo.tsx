'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Gift, Users, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from './ClientOnly';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trusted & Secure",
    description: "Licensed casinos with verified security measures",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: "Exclusive Bonuses",
    description: "Special offers and promotions for our members",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Driven",
    description: "Real reviews from verified players",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Expert Reviews",
    description: "Professional analysis and ratings",
    color: "from-orange-500 to-red-500"
  }
];

const stats = [
  { label: "Casinos Reviewed", value: "87+", icon: <Star className="w-5 h-5" /> },
  { label: "Active Members", value: "1,081+", icon: <Users className="w-5 h-5" /> },
  { label: "Bonus Offers", value: "800+", icon: <Gift className="w-5 h-5" /> },
  { label: "Success Rate", value: "99%", icon: <TrendingUp className="w-5 h-5" /> }
];

export default function BannerInfo() {
  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff9a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <ClientOnly fallback={
      <section className="relative py-6 sm:py-12 lg:py-16 xl:py-20 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-4 sm:mb-8 lg:mb-12 xl:mb-16">
            <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-white mb-2 sm:mb-4 lg:mb-6">
              Why Choose <span className="bg-gradient-to-r from-casino-neon-green to-emerald-400 bg-clip-text text-transparent">CGSG</span>?
            </h2>
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
              Loading features...
            </p>
          </div>
        </div>
      </section>
    }>
      <section className="relative py-6 sm:py-12 lg:py-16 xl:py-20 bg-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("${backgroundPattern}")` }}
        ></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Responsive: Mobile COMPACT, Desktop NORMAL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-8 lg:mb-12 xl:mb-16"
        >
          <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-white mb-2 sm:mb-4 lg:mb-6">
            Why Choose <span className="bg-gradient-to-r from-casino-neon-green to-emerald-400 bg-clip-text text-transparent">CGSG</span>?
          </h2>
          <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-xs sm:max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in finding the best online casinos with expert reviews, exclusive bonuses, and community-driven insights.
          </p>
        </motion.div>

        {/* Features Grid - Responsive: Mobile COMPACT, Desktop NORMAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mb-4 sm:mb-8 lg:mb-12 xl:mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-900/60 backdrop-blur-sm border border-casino-neon-green/20 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 text-center transition-all duration-300 hover:border-casino-neon-green/40 hover:shadow-lg hover:shadow-casino-neon-green/10 transform hover:scale-105">
                <div className={`inline-flex p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${feature.color} mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white mb-1 sm:mb-2 lg:mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section - Responsive: Mobile COMPACT, Desktop NORMAL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gray-900/40 backdrop-blur-sm border border-casino-neon-green/20 rounded-lg sm:rounded-xl lg:rounded-2xl xl:rounded-3xl p-3 sm:p-6 lg:p-8 xl:p-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl bg-casino-neon-green/10 border border-casino-neon-green/20 mb-1 sm:mb-2 lg:mb-3 group-hover:bg-casino-neon-green/20 transition-colors duration-300">
                  <div className="text-casino-neon-green">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-black text-casino-neon-green mb-0.5 sm:mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Start Your Casino Journey?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/casinos" className="group w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-casino-neon-green to-emerald-400 hover:from-emerald-400 hover:to-casino-neon-green text-casino-dark font-semibold px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-casino-neon-green/25">
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <span className="whitespace-nowrap">Explore Casinos</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="/best-bonuses" className="group w-full sm:w-auto">
              <button className="w-full sm:w-auto border-2 border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark font-semibold px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm">
                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <span className="whitespace-nowrap">View Bonuses</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
    </ClientOnly>
  );
}
