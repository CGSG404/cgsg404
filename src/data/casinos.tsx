import { type Review } from "@/components/ReviewDetail/types";

export const casinos: Review[] = [
  {
    slug: "lucky-dreams",
    name: "Lucky Dreams Casino",
    logo: "/casinos/lucky-dreams.svg",
    rating: 9.2,
    bonus: "100% up to $500 + 200 free spins",
    description: "Modern online casino with a wide selection of games and excellent bonuses",
    articles: [
      {
        slug: "review-lengkap",
        title: "Tentang Lucky Dreams Casino - Review Lengkap",
        summary: "Ulasan mendalam tentang fitur, bonus, dan pengalaman bermain di Lucky Dreams Casino.",
        content: "<strong>Lucky Dreams Casino</strong> adalah salah satu casino online populer yang menawarkan berbagai fitur menarik untuk pemain Indonesia. Dengan bonus sambutan yang kompetitif dan pilihan game yang beragam, casino ini layak dipertimbangkan untuk para pecinta judi online. Selain itu, Lucky Dreams Casino juga dikenal dengan keamanan dan kecepatan transaksi yang baik. Tim support yang responsif dan platform mobile-friendly membuat pengalaman bermain semakin nyaman.",
        imageUrl: "/casino-feature-banner-demo.jpg"
      }
    ],
    games: ["Slots", "Live Casino", "Table Games", "Sports Betting"],
    paymentMethods: ["Visa", "Mastercard", "Bitcoin", "PayPal"],
    features: ["24/7 Support", "Mobile Optimized", "Fast Payouts", "Multiple Languages"],
    safetyIndex: "High",
    isNew: true,
    badges: ["New Bonus", "Live Casino"],
    links: { bonus: "#", review: "#", complaint: "#" },
    playUrl: "#"
  },
  {
    slug: "malina",
    name: "Malina Casino",
    logo: "/casinos/malina.svg",
    rating: 9.8,
    bonus: "100% up to $500 + 200 free spins",
    description: "Luxury online casino with premium games and exclusive bonuses",
    articles: [
      {
        slug: "review-lengkap",
        title: "Tentang Malina Casino - Review Lengkap",
        summary: "Ulasan mendalam tentang fitur, bonus, dan pengalaman bermain di Malina Casino.",
        content: "<strong>Malina Casino</strong> adalah casino online mewah dengan game premium dan bonus eksklusif. Menawarkan pengalaman bermain yang elegan dan layanan pelanggan terbaik.",
        imageUrl: "/casino-feature-banner-demo.jpg"
      }
    ],
    games: ["Slots", "Live Casino", "Table Games", "Video Poker"],
    paymentMethods: ["Visa", "Mastercard", "Skrill", "Neteller"],
    features: ["VIP Program", "Live Support", "Fast Withdrawals", "Bonus System"],
    safetyIndex: "Very High",
    isNew: false,
    badges: ["VIP Program", "Exclusive Bonuses"],
    links: { bonus: "#", review: "#", complaint: "#" },
    playUrl: "#"
  },
  {
    slug: "rabona",
    name: "Rabona Casino",
    logo: "/casinos/rabona.svg",
    rating: 9.4,
    bonus: "225% up to $750 + 100 spins",
    description: "Sports-focused casino with excellent betting options",
    articles: [
      {
        slug: "review-lengkap",
        title: "Tentang Rabona Casino - Review Lengkap",
        summary: "Ulasan mendalam tentang fitur, bonus, dan pengalaman bermain di Rabona Casino.",
        content: "<strong>Rabona Casino</strong> adalah kasino yang berfokus pada olahraga dengan opsi taruhan yang sangat baik. Cocok untuk pemain yang menyukai taruhan olahraga dan permainan kasino dalam satu platform.",
        imageUrl: "/casino-feature-banner-demo.jpg"
      }
    ],
    games: ["Sports", "Slots", "Live Casino", "Table Games"],
    paymentMethods: ["Visa", "Mastercard", "Crypto", "Bank Transfer"],
    features: ["Sports Betting", "Live Streaming", "Fast Payouts", "Mobile App"],
    safetyIndex: "High",
    isNew: true,
    badges: ["Sports Betting", "Live Streaming"],
    links: { bonus: "#", review: "#", complaint: "#" },
    playUrl: "#"
  },
  {
    slug: "casino-x",
    name: "Casino X",
    logo: "/casinos/casino-x.svg",
    rating: 8.9,
    bonus: "150% up to $1000",
    description: "Premium casino with exclusive game selection",
    articles: [
      {
        slug: "review-lengkap",
        title: "Tentang Casino X - Review Lengkap",
        summary: "Ulasan mendalam tentang fitur, bonus, dan pengalaman bermain di Casino X.",
        content: "<strong>Casino X</strong> adalah kasino premium dengan pilihan permainan eksklusif. Menawarkan pengalaman bermain yang unik dengan jackpot progresif dan turnamen reguler.",
        imageUrl: "/casino-feature-banner-demo.jpg"
      }
    ],
    games: ["Slots", "Live Casino", "Table Games", "Specialty Games"],
    paymentMethods: ["Visa", "Mastercard", "Crypto", "E-wallet"],
    features: ["VIP Lounge", "Exclusive Bonuses", "24/7 Support", "Mobile Gaming"],
    safetyIndex: "Very High",
    isNew: false,
    badges: ["VIP Lounge", "Exclusive Bonuses"],
    links: { bonus: "#", review: "#", complaint: "#" },
    playUrl: "#"
  },
  {
    slug: "starlight",
    name: "Starlight Casino",
    logo: "/casinos/starlight.svg",
    rating: 9.1,
    bonus: "125% up to $600 + 150 spins",
    description: "Stellar online casino experience with top-notch games",
    articles: [
      {
        slug: "review-lengkap",
        title: "Tentang Starlight Casino - Review Lengkap",
        summary: "Ulasan mendalam tentang fitur, bonus, dan pengalaman bermain di Starlight Casino.",
        content: "<strong>Starlight Casino</strong> menawarkan pengalaman kasino online yang luar biasa dengan permainan terbaik. Nikmati suasana bermain yang futuristik dan bonus yang menguntungkan.",
        imageUrl: "/casino-feature-banner-demo.jpg"
      }
    ],
    games: ["Slots", "Live Casino", "Table Games", "Progressive Jackpots"],
    paymentMethods: ["Visa", "Mastercard", "Crypto", "Bank Transfer"],
    features: ["Progressive Jackpots", "Live Support", "Fast Payouts", "Multiple Languages"],
    safetyIndex: "High",
    isNew: true,
    badges: ["Progressive Jackpots", "Live Support"],
    links: { bonus: "#", review: "#", complaint: "#" },
    playUrl: "#"
  }
];
