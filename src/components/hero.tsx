export function Hero() {
  return (
    <section className="animate-hero-fade pt-2 pb-4 max-w-[560px]">
      <p className="text-[28px] md:text-[32px] leading-[1.45] text-[#c0c0c0] font-light">
        Hey there, I&apos;m{" "}
        <span className="text-[#1a1a1a] font-light">Ryan</span>{" "}
        <span className="inline-block">👋</span>{" "}
        Welcome to my corner of the internet{" "}
        <span className="inline-block">🌱</span>{" "}
        I like building{" "}
        <span className="text-[#1a1a1a] font-light link-underline cursor-pointer">
          things
        </span>
        , and I&apos;m studying{" "}
        <span className="text-[#1a1a1a] font-light wavy-hover cursor-pointer">
          Mechatronics Engineering
        </span>{" "}
        at{" "}
        <span className="text-[#1a1a1a] font-light wavy-hover cursor-pointer">
          UWaterloo
        </span>.
      </p>

      <p className="text-[28px] md:text-[32px] leading-[1.45] text-[#c0c0c0] font-light mt-8">
        In my free time, I enjoy listening to{" "}
        <span className="text-[#1a1a1a] font-light link-underline cursor-pointer">
          music
        </span>
        , watching{" "}
        <span className="text-[#1a1a1a] font-light link-underline cursor-pointer">
          anime
        </span>
        , and working on{" "}
        <span className="text-[#1a1a1a] font-light link-underline cursor-pointer">
          robots
        </span>.
      </p>
    </section>
  );
}
