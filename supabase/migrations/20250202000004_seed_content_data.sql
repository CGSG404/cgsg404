-- Seed data for content management tables
-- Migration: 20250202000004_seed_content_data.sql

-- 1. Insert sample Hero Banner data
INSERT INTO public.hero_banners (
    title, 
    subtitle, 
    highlight, 
    cta_text, 
    cta_link, 
    image_url, 
    gradient_class, 
    display_order, 
    is_active
) VALUES 
(
    'Welcome to CGSG!',
    'Your Trusted Casino Guide Singapore',
    'DISCOVER THE BEST CASINOS! 🎰',
    'Get Started',
    '/casinos',
    '/news-banner/domain.png',
    'from-casino-dark to-purple-900',
    1,
    true
),
(
    'Exclusive Bonuses',
    'Up to 200% Welcome Bonus + Free Spins',
    'CLAIM YOUR BONUS NOW! 🎁',
    'View Bonuses',
    '/best-bonuses',
    '/news-banner/domain1.png',
    'from-casino-dark to-purple-900',
    2,
    true
),
(
    'Success Stories',
    'Join Our Winning Community',
    'BE THE NEXT WINNER! 🏆',
    'Read Stories',
    '/success-stories',
    '/success-stories-cgsg.png',
    'from-casino-dark to-purple-900',
    3,
    true
);

-- 2. Insert sample Running Text data
INSERT INTO public.running_texts (text, priority, is_active) VALUES 
('🎰 Welcome to Casino Singapore Guide - Your trusted source for casino reviews and bonuses!', 1, true),
('🎁 New players get up to 200% welcome bonus + 50 free spins!', 2, true),
('🏆 Join thousands of satisfied players who trust our recommendations!', 3, true),
('📱 Mobile-friendly casinos with instant withdrawals available now!', 4, true);

-- 3. Insert sample Hero Content data
INSERT INTO public.hero_content (
    main_title,
    subtitle,
    description,
    primary_cta_text,
    primary_cta_link,
    secondary_cta_text,
    secondary_cta_link,
    background_image,
    is_active
) VALUES (
    'Find Your Perfect Casino',
    'Trusted Reviews & Exclusive Bonuses',
    'Discover the best online casinos in Singapore with our comprehensive reviews, safety ratings, and exclusive bonus offers.',
    'Browse Casinos',
    '/casinos',
    'View Bonuses',
    '/best-bonuses',
    '/hero-bg.jpg',
    true
);

-- 4. Insert sample Info Banner data
INSERT INTO public.info_banners (
    title,
    description,
    icon,
    background_color,
    text_color,
    cta_text,
    cta_link,
    display_order,
    is_active
) VALUES 
(
    'Safe & Secure',
    'All recommended casinos are licensed and regulated',
    'shield-check',
    'bg-green-900',
    'text-white',
    'Learn More',
    '/safety',
    1,
    true
),
(
    '24/7 Support',
    'Get help anytime with our dedicated support team',
    'headphones',
    'bg-blue-900',
    'text-white',
    'Contact Us',
    '/support',
    2,
    true
);

-- 5. Insert sample FAQ data
INSERT INTO public.faqs (
    question,
    answer,
    icon,
    category,
    display_order,
    is_active
) VALUES 
(
    'Free Credit Bonus',
    'Get exclusive bonuses without the need to make a deposit. Simply register and claim your rewards to start playing.',
    'gift',
    'bonuses',
    1,
    true
),
(
    'Welcome Bonus',
    'Double or even triple your first deposit with lucrative welcome offers from our partner casinos.',
    'party-popper',
    'bonuses',
    2,
    true
),
(
    'Free Spins',
    'Enjoy free spins on a variety of popular slot games. A golden opportunity to win big without risking your money.',
    'ticket',
    'bonuses',
    3,
    true
),
(
    'How do I choose a safe casino?',
    'Look for casinos with proper licensing, SSL encryption, fair gaming certificates, and positive user reviews.',
    'shield',
    'safety',
    4,
    true
),
(
    'What payment methods are accepted?',
    'Most casinos accept credit cards, e-wallets, bank transfers, and cryptocurrency payments.',
    'credit-card',
    'payments',
    5,
    true
);

-- 6. Insert sample Partner Logo data
INSERT INTO public.partner_logos (
    name,
    logo_url,
    website_url,
    alt_text,
    display_order,
    is_active
) VALUES 
(
    'PAGCOR',
    '/logos/PAGCOR.png',
    'https://www.pagcor.ph',
    'PAGCOR Licensed',
    1,
    true
),
(
    'iTech Labs',
    '/logos/itechlabs.png',
    'https://www.itechlabs.com',
    'iTech Labs Certified',
    2,
    true
),
(
    'BMM Testlabs',
    '/logos/bmm-logo.png',
    'https://www.bmm.com',
    'BMM Testlabs Verified',
    3,
    true
),
(
    'TST',
    '/logos/TST.jpg',
    'https://www.tst.com',
    'TST Approved',
    4,
    true
),
(
    'GoDaddy SSL',
    '/logos/godaddy.png',
    'https://www.godaddy.com',
    'GoDaddy SSL Secured',
    5,
    true
),
(
    'Iovation',
    '/logos/iovation.png',
    'https://www.iovation.com',
    'Iovation Fraud Protection',
    6,
    true
);

-- 7. Insert sample Statistics data
INSERT INTO public.statistics (
    title,
    value,
    description,
    icon,
    chart_type,
    color,
    display_order,
    is_active
) VALUES 
(
    'Trusted Casinos',
    '50+',
    'Verified and licensed casino partners',
    'building-storefront',
    'number',
    'text-blue-400',
    1,
    true
),
(
    'Happy Players',
    '10,000+',
    'Satisfied customers worldwide',
    'users',
    'number',
    'text-green-400',
    2,
    true
),
(
    'Total Bonuses',
    '$2M+',
    'In exclusive bonuses claimed',
    'gift',
    'number',
    'text-yellow-400',
    3,
    true
),
(
    'Success Rate',
    '98%',
    'Customer satisfaction rating',
    'star',
    'percentage',
    'text-purple-400',
    4,
    true
);