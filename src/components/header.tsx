"use client";

import { useState, useRef, useEffect } from "react";

const leftLinks = [
  { label: "Ryan", href: "/", isName: true },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Hobbies", href: "#hobbies" },
];

const rightLinks = [
  { label: "GitHub", href: "https://github.com", external: true },
  { label: "LinkedIn", href: "https://linkedin.com", external: true },
  { label: "CV", href: "/resume" },
];

export function Header() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const idx = hoveredIdx ?? activeIdx;
    const el = linkRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  }, [hoveredIdx, activeIdx]);

  return (
    <header className="animate-fade-in delay-0 flex items-center justify-between pt-4 pb-3 -ml-6">
      {/* Left nav with sliding pill */}
      <div
        ref={navRef}
        className="relative flex items-center gap-0 text-[13px] rounded-lg border border-[#eee] bg-white px-0.5 py-0.5"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)" }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Sliding pill background */}
        <div
          className="absolute top-0.5 h-[calc(100%-4px)] rounded-md bg-[#f5f5f5] pointer-events-none"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
            opacity: pillStyle.opacity,
            transition: "left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.15s ease",
          }}
        />

        {leftLinks.map((link, i) => (
          <a
            key={link.label}
            ref={(el) => { linkRefs.current[i] = el; }}
            href={link.href}
            className={`relative z-10 px-3 py-1 rounded-md transition-colors duration-200 ${
              link.isName
                ? "font-medium text-[#1a1a1a]"
                : "text-[#999] hover:text-[#555]"
            }`}
            onMouseEnter={() => setHoveredIdx(i)}
            onClick={() => setActiveIdx(i)}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right nav */}
      <nav
        className="flex items-center gap-5 text-[13px] text-[#999]"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {rightLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="hover:text-[#1a1a1a] transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
