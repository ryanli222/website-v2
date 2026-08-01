"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const leftLinks = [
  { label: "ryan", href: "/", isName: true },
  { label: "projects", href: "/projects" },
  { label: "experience", href: "/experience" },
];

const rightLinks = [
  { label: "github", href: "https://github.com/ryanli222", external: true },
  { label: "linkedin", href: "https://www.linkedin.com/in/ryanli222/", external: true },
  { label: "cv", href: "/resume" },
];

interface HeaderProps {
  activeTab?: string;
}

export function Header({ activeTab }: HeaderProps = {}) {
  const defaultIdx = activeTab
    ? leftLinks.findIndex((l) => l.label === activeTab)
    : 0;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(defaultIdx >= 0 ? defaultIdx : 0);
  const navRef = useRef<HTMLElement>(null);
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
    <header className="flex flex-col items-start gap-3 pt-4 pb-3 sm:-ml-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <nav
        ref={navRef}
        aria-label="Primary"
        className="animate-slide-left relative flex items-center gap-0 rounded-lg border border-[#eee] bg-white px-0.5 py-0.5 text-[13px]"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)" }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <div
          className="pointer-events-none absolute top-0.5 h-[calc(100%-4px)] rounded-md bg-[#f5f5f5]"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
            opacity: pillStyle.opacity,
            transition: "left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.15s ease",
          }}
        />

        {leftLinks.map((link, i) => (
          <Link
            key={link.label}
            ref={(el) => { linkRefs.current[i] = el; }}
            href={link.href}
            className={`relative z-10 rounded-md px-3 py-1 transition-colors duration-200 ${
              link.isName
                ? "font-medium text-[#1a1a1a]"
                : "text-[#767676] hover:text-[#555]"
            }`}
            onMouseEnter={() => setHoveredIdx(i)}
            onClick={() => setActiveIdx(i)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <nav
        aria-label="External links"
        className="animate-slide-left flex w-full flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#767676] sm:w-auto sm:flex-nowrap"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {rightLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="transition-colors duration-200 hover:text-[#1a1a1a]"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
