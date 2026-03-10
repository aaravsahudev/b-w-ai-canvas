const MarqueeBanner = () => {
  const text = "QUICKWEBSTACK — AI GENERATION — UNLIMITED POWER — CREATE ANYTHING — ";

  return (
    <section className="border-t border-b border-border py-6 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="font-display text-3xl md:text-5xl font-bold tracking-tight mr-4">
            {text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
