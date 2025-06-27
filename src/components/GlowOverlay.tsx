const GlowOverlay = () => (
  <div className="absolute inset-0 z-10 blur-3xl pointer-events-none">
    <div className="absolute -top-1/4 left-0 w-3/4 h-3/4 bg-casino-neon-green/30 rounded-full" />
    <div className="absolute -bottom-1/4 right-0 w-3/4 h-3/4 bg-casino-neon-purple/30 rounded-full" />
  </div>
);

export default GlowOverlay;
