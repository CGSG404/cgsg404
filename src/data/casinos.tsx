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
        slug: "full-review",
        title: "About Lucky Dreams Casino - Full Review",
        summary: "In-depth review of the features, bonuses, and playing experience at Lucky Dreams Casino.",
        content: "<strong>Lucky Dreams Casino</strong> is one of the popular online casinos that offers various attractive features for Indonesian players. With competitive welcome bonuses and a diverse selection of games, this casino is worth considering for online gambling enthusiasts. In addition, Lucky Dreams Casino is also known for its good security and transaction speed. A responsive support team and a mobile-friendly platform make the playing experience even more comfortable.",
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
    rating: 8.9,
    bonus: "120% up to $300 + 150 free spins",
    description: "Bright and modern casino with a focus on slots and regular promotions",
    articles: [
      {
        slug: "full-review",
        title: "About Malina Casino - Full Review",
        summary: "In-depth review of the features, bonuses, and playing experience at Malina Casino.",
        content: "<strong>Malina Casino</strong> offers a bright and modern interface, very appealing to players who love slots. They have a great loyalty program and regular promotions that keep players engaged. Security at Malina Casino is also a priority, with SSL encryption to protect player data. Customer support is available 24/7 to help with any issues.",
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
    rating: 9.5,
    bonus: "150% up to $750 + 100 free spins",
    description: "Sports-themed casino with a huge selection of games and betting options",
    articles: [
      {
        slug: "full-review",
        title: "About Rabona Casino - Full Review",
        summary: "In-depth review of the features, bonuses, and playing experience at Rabona Casino.",
        content: "<strong>Rabona Casino</strong> is an excellent choice for players who also enjoy sports betting. They combine a comprehensive sportsbook with a feature-rich online casino. Their welcome bonus is very generous, and they offer ongoing promotions related to sporting events. The platform is well-designed and easy to navigate, making it a favorite among many players.",
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
    rating: 8.7,
    bonus: "200% up to $2000 + 200 free spins",
    description: "A classic choice with a massive welcome bonus and a time-tested reputation",
    articles: [
      {
        slug: "full-review",
        title: "About Casino X - Full Review",
        summary: "In-depth review of the features, bonuses, and playing experience at Casino X.",
        content: "<strong>Casino X</strong> has been around for a while and has built a solid reputation. They are known for their massive welcome bonus, which is one of the largest in the industry. Their game selection is extensive, covering everything from slots to table games and live casino. Reliability and trustworthiness are key strong points for Casino X.",
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
    slug: "starlight-casino",
    name: "Starlight Casino",
    logo: "/casinos/starlight.svg",
    rating: 9.0,
    bonus: "100% up to $400 + 100 free spins",
    description: "Elegant and user-friendly casino with a great mobile experience",
    articles: [
      {
        slug: "full-review",
        title: "About Starlight Casino - Full Review",
        summary: "In-depth review of the features, bonuses, and playing experience at Starlight Casino.",
        content: "<strong>Starlight Casino</strong> focuses on providing an elegant and user-friendly experience. Their design is clean and easy to navigate, especially on mobile devices. They offer a balanced bonus and a solid selection of games from top providers. Starlight Casino is a great choice for players who value aesthetics and smooth gameplay.",
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
