import React from 'react';

// Komponen background blur animasi, bisa ditaruh di belakang konten utama
const AnimatedBlurBG: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 select-none overflow-hidden">
      {/* Blur besar hijau-ungu-oranye */}
      <div className="absolute left-[-200px] top-[-150px] w-[700px] h-[700px] bg-gradient-to-br from-casino-neon-green via-purple-600 to-orange-400 opacity-50 blur-[120px] animate-spin-slow rounded-full" />
      {/* Blur besar oranye-hijau */}
      <div className="absolute right-[-120px] bottom-[-120px] w-[400px] h-[400px] bg-gradient-to-br from-orange-400 via-casino-neon-green to-yellow-400 opacity-40 blur-[100px] animate-pulse rounded-full" />
      {/* Blur besar ungu-hijau terang */}
      <div className="absolute right-1/4 top-1/3 w-[300px] h-[300px] bg-gradient-to-br from-purple-400 via-casino-neon-green to-indigo-400 opacity-35 blur-[90px] animate-spin rounded-full" />
      {/* Blur kecil oranye-pink-ungu */}
      <div className="absolute right-12 bottom-24 w-[180px] h-[180px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 opacity-30 blur-2xl animate-pulse rounded-full" />
      {/* Garis hijau */}
      <div className="absolute left-0 top-1/3 w-2 h-1/2 bg-gradient-to-b from-casino-neon-green to-transparent opacity-50 blur-xl animate-fade-in-up" />
      {/* Garis oranye */}
      <div className="absolute right-0 top-1/2 w-2 h-1/3 bg-gradient-to-b from-orange-400 to-transparent opacity-50 blur-xl animate-fade-in-down" />
    </div>
  );
};

export default AnimatedBlurBG;
