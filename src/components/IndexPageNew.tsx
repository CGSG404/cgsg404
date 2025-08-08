'use client';

import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import ProfessionalNavbar from '@/src/components/ProfessionalNavbar';
import CookieConsent from '@/src/components/CookieConsent';
import { 
  Shield, 
  Award, 
  Gift, 
  TrendingUp, 
  Star, 
  ArrowRight,
  Users,
  CheckCircle,
  Globe,
  Clock,
  Target,
  Phone,
  Mail,
  Sparkles,
  Zap,
  Eye,
  Heart
} from 'lucide-react';

// Lazy loaded components
const HeroBannerSlider = lazy(() => import('@/src/components/HeroBannerSlider'));
const BannerInfo = lazy(() => import('@/src/components/BannerInfo'));
const RunningTextTicker = lazy(() => import('@/src/components/RunningTextTicker'));
const LogoSlider = lazy(() => import('@/src/components/LogoSlider'));
const Chart = lazy(() => import('@/src/components/Chart'));
const Footer = lazy(() => import('@/src/components/Footer'));

// Enhanced Loading Components with animations
const SimpleLoader = ({ className }: { className?: string }) => (
  <motion.div 
    className={`bg-gray-100 rounded-lg ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="animate-pulse bg-gray-200 h-full rounded-lg"></div>
  </motion.div>
);

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      let start = 0;
      const increment = numericValue / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// Floating Elements Component
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

const IndexPageNew = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  
  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
    
    // Mouse tracking for subtle interactions
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <ProfessionalNavbar />
      </div>

      {/* Enhanced Hero Section with Animations */}
      <motion.section 
        ref={heroRef}
        className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-100 py-20 lg:py-28 overflow-hidden"
        style={{ y, opacity }}
      >
        <FloatingElements />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Enhanced Professional Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8 shadow-sm backdrop-blur-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59,130,246,0.15)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-4 h-4" />
              </motion.div>
              <span>Trusted Casino Reviews & Analysis</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>

            {/* Enhanced Main Title with Gradient Text */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Find The Best
              <motion.span 
                className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Online Casinos
              </motion.span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Expert reviews, comprehensive analysis, and trusted recommendations 
              to help you discover safe and reliable online gaming experiences.
            </motion.p>

            {/* Enhanced CTA Buttons with Micro-interactions */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">View Top Casinos</span>
                <motion.div
                  className="group-hover:translate-x-1 transition-transform duration-200"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>

              <motion.button 
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Read Expert Reviews
              </motion.button>
            </motion.div>

            {/* Enhanced Stats Section with Animated Counters */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { label: 'Casinos Reviewed', value: '500', suffix: '+', icon: Shield, color: 'blue' },
                { label: 'Happy Players', value: '100', suffix: 'K+', icon: Users, color: 'green' },
                { label: 'Countries Served', value: '50', suffix: '+', icon: Globe, color: 'purple' },
                { label: 'Expert Rating', value: '4.9', suffix: '/5', icon: Star, color: 'orange' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className={`inline-flex items-center justify-center w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-lg mb-3 group-hover:shadow-lg transition-all duration-300`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.3),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-6 shadow-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Why Choose Our Platform</span>
              <Zap className="w-4 h-4" />
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Expert Reviews You Can Trust
            </motion.h2>

            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our experienced team provides unbiased analysis and comprehensive reviews 
              to help you make informed decisions about online gambling.
            </motion.p>
          </motion.div>

          {/* Enhanced Features Grid with Stagger Animation */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              {
                icon: Shield,
                title: 'Security & Safety',
                description: 'All reviewed casinos are licensed and regulated by reputable gaming authorities with proven security measures.',
                color: 'blue'
              },
              {
                icon: Award,
                title: 'Expert Analysis',
                description: 'Professional casino experts with years of experience provide detailed analysis and honest reviews.',
                color: 'green'
              },
              {
                icon: Gift,
                title: 'Best Bonuses',
                description: 'We negotiate exclusive bonuses and promotions that you won\'t find anywhere else.',
                color: 'purple'
              },
              {
                icon: TrendingUp,
                title: 'Performance Tracking',
                description: 'Real-time monitoring of casino performance, payout rates, and player satisfaction scores.',
                color: 'orange'
              },
              {
                icon: Clock,
                title: '24/7 Updates',
                description: 'Our platform is continuously updated with the latest information and casino developments.',
                color: 'red'
              },
              {
                icon: Target,
                title: 'Proven Results',
                description: 'Track record of helping players find reliable casinos with consistently high success rates.',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="group relative p-8 bg-gray-50 rounded-2xl hover:bg-white transition-all duration-500 border border-gray-100 cursor-pointer overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  y: -5
                }}
                onHoverStart={() => {}}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                {/* Animated icon container */}
                <motion.div 
                  className={`relative w-12 h-12 bg-${feature.color}-100 text-${feature.color}-600 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  
                  {/* Pulse effect */}
                  <motion.div
                    className={`absolute inset-0 bg-${feature.color}-200 rounded-lg opacity-0 group-hover:opacity-30`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <motion.h3 
                  className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p 
                  className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                
                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: 10 }}
                  whileHover={{ x: 0 }}
                >
                  <ArrowRight className={`w-5 h-5 text-${feature.color}-500`} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {isLoaded && (
        <>
          {/* Running Text Ticker */}
          <motion.section 
            className="py-4 bg-blue-50 border-y border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={<SimpleLoader className="h-12 mx-4" />}>
              <RunningTextTicker />
            </Suspense>
          </motion.section>

          {/* Banner Info Section */}
          <motion.section 
            className="py-16 bg-gray-50 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-green-500/5"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgba(168,85,247,0.05), rgba(34,197,94,0.05))",
                  "linear-gradient(135deg, rgba(34,197,94,0.05), rgba(168,85,247,0.05))",
                  "linear-gradient(45deg, rgba(168,85,247,0.05), rgba(34,197,94,0.05))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden backdrop-blur-sm"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <Suspense fallback={<SimpleLoader className="h-64" />}>
                  <BannerInfo />
                </Suspense>
              </motion.div>
            </div>
          </motion.section>

          {/* Casino Showcase */}
          <motion.section 
            className="py-20 bg-white relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.3),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(34,197,94,0.3),transparent_50%)]" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-green-50 border border-purple-200 rounded-full text-purple-700 text-sm font-medium mb-6 shadow-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-4 h-4" />
                  <span>Premium Casino Partners</span>
                  <Heart className="w-4 h-4" />
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Featured Casino Partners
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  Handpicked casinos that meet our strict quality and safety standards
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-8 border border-gray-200 overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-green-400 rounded-full opacity-20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-20, -100],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3
                      }}
                    />
                  ))}
                </div>
                
                {/* Glowing border effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(168,85,247,0.1)",
                      "inset 0 0 40px rgba(34,197,94,0.15)",
                      "inset 0 0 20px rgba(168,85,247,0.1)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  <Suspense fallback={<SimpleLoader className="h-64" />}>
                    <HeroBannerSlider isHomePage={true} />
                  </Suspense>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Logo Slider */}
          <motion.section 
            className="py-16 bg-gray-50 relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Moving gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-green-500/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Trusted by Leading Brands
                </h2>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-6 border border-gray-200 backdrop-blur-sm"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <Suspense fallback={<SimpleLoader className="h-24" />}>
                  <LogoSlider />
                </Suspense>
              </motion.div>
            </div>
          </motion.section>

          {/* Chart Section */}
          <motion.section 
            className="py-20 bg-white relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }} />
            </div>
            
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-purple-500/5"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Market Analysis & Insights
                </h2>
                <p className="text-xl text-gray-600">
                  Data-driven insights to help you make informed decisions
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200 backdrop-blur-sm"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <Suspense fallback={<SimpleLoader className="h-96" />}>
                  <Chart />
                </Suspense>
              </motion.div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, -80],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/50 relative overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Glowing border effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(59,130,246,0.1)",
                      "inset 0 0 40px rgba(168,85,247,0.15)",
                      "inset 0 0 20px rgba(59,130,246,0.1)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <motion.div 
                  className="text-center mb-8 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6 shadow-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Expert Support Available</span>
                    <Heart className="w-4 h-4" />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Need Expert Guidance?
                  </motion.h2>
                  
                  <motion.p 
                    className="text-xl text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Our team is here to help you find the perfect casino for your needs
                  </motion.p>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.2
                      }
                    }
                  }}
                >
                  <motion.div 
                    className="group text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 cursor-pointer relative overflow-hidden"
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.9 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px rgba(59,130,246,0.15)",
                      y: -5
                    }}
                  >
                    <motion.div 
                      className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4 group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Phone className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">24/7 Support</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Get instant help from our expert team</p>
                    
                    {/* Hover indicator */}
                    <motion.div
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: 10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    className="group text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 cursor-pointer relative overflow-hidden"
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.9 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px rgba(34,197,94,0.15)",
                      y: -5
                    }}
                  >
                    <motion.div 
                      className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4 group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Mail className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">Expert Consultation</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Personalized recommendations just for you</p>
                    
                    {/* Hover indicator */}
                    <motion.div
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: 10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="w-5 h-5 text-green-500" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="text-center mt-8 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.button 
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg overflow-hidden shadow-lg"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(59,130,246,0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    <span className="relative z-10 flex items-center gap-2">
                      Contact Our Experts
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer 
            className="relative bg-gray-900 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            {/* Subtle moving gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgba(59,130,246,0.05), rgba(168,85,247,0.05), rgba(34,197,94,0.05))",
                  "linear-gradient(135deg, rgba(34,197,94,0.05), rgba(59,130,246,0.05), rgba(168,85,247,0.05))",
                  "linear-gradient(45deg, rgba(59,130,246,0.05), rgba(168,85,247,0.05), rgba(34,197,94,0.05))"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-10, -60],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <Suspense fallback={<SimpleLoader className="h-64 bg-gray-800" />}>
                <Footer />
              </Suspense>
            </div>
          </motion.footer>
        </>
      )}

      {/* Simple Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-50"
      >
        <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
      </button>

      <CookieConsent />
    </div>
  );
};

export default IndexPageNew;