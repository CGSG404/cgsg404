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
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-casino-dark via-casino-darker to-casino-dark overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-casino-neon-green to-emerald-400 bg-clip-text text-transparent">CGSG</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Loading features...
            </p>
          </div>
        </div>
      </section>
    }>
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-casino-dark via-casino-darker to-casino-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("${backgroundPattern}")` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Why Choose <span className="bg-gradient-to-r from-casino-neon-green to-emerald-400 bg-clip-text text-transparent">CGSG</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in finding the best online casinos with expert reviews, exclusive bonuses, and community-driven insights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-casino-card-bg/60 to-casino-darker/60 backdrop-blur-sm border border-casino-neon-green/20 rounded-2xl p-6 text-center transition-all duration-300 hover:border-casino-neon-green/40 hover:shadow-lg hover:shadow-casino-neon-green/10 transform hover:scale-105">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-casino-card-bg/40 to-casino-darker/40 backdrop-blur-sm border border-casino-neon-green/20 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex p-3 rounded-xl bg-casino-neon-green/10 border border-casino-neon-green/20 mb-3 group-hover:bg-casino-neon-green/20 transition-colors duration-300">
                  <div className="text-casino-neon-green">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-casino-neon-green mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-300 font-medium">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/casinos" className="group">
              <button className="bg-gradient-to-r from-casino-neon-green to-emerald-400 hover:from-emerald-400 hover:to-casino-neon-green text-casino-dark font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-casino-neon-green/25">
                <span className="flex items-center gap-2">
                  Explore Casinos
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="/best-bonuses" className="group">
              <button className="border-2 border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  View Bonuses
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
