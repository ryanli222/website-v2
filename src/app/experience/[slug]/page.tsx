"use client";

import type { MouseEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getExperienceBySlug } from "@/data/experience";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ImageGallery from "@/components/image-gallery";

export default function ExperiencePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const experience = getExperienceBySlug(slug);

  const [activeSection, setActiveSection] = useState<string>("");
  const [highlightedSection, setHighlightedSection] = useState<{
    id: string;
    token: number;
  } | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightFrameRef = useRef<number | null>(null);
  const manualSelectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualSelectionRef = useRef<string | null>(null);
  const refreshActiveSectionRef = useRef<() => void>(() => {});

  const getAnchor = (id: string) =>
    id
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    if (!experience?.sections) return;

    const anchors = experience.sections.map((s) => getAnchor(s.id));

    const update = () => {
      if (manualSelectionRef.current) {
        setActiveSection(manualSelectionRef.current);
        return;
      }
      const els = anchors
        .map((a) => {
          const el = document.getElementById(a);
          return el ? { a, el } : null;
        })
        .filter(
          (item): item is { a: string; el: HTMLElement } => item !== null,
        );
      if (!els.length) return;

      const scrollPos = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight - scrollPos <= 8) {
        setActiveSection(anchors[anchors.length - 1]);
        return;
      }

      const vc = window.scrollY + window.innerHeight / 2;
      let closest = els[0].a;
      let closestDist = Number.POSITIVE_INFINITY;
      for (const { a, el } of els) {
        const r = el.getBoundingClientRect();
        const c = window.scrollY + r.top + r.height / 2;
        const d = Math.abs(c - vc);
        if (d < closestDist) {
          closestDist = d;
          closest = a;
        }
      }
      setActiveSection(closest);
    };

    refreshActiveSectionRef.current = update;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      refreshActiveSectionRef.current = () => {};
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [experience]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
      if (highlightFrameRef.current !== null)
        cancelAnimationFrame(highlightFrameRef.current);
      if (manualSelectionTimeoutRef.current)
        clearTimeout(manualSelectionTimeoutRef.current);
    };
  }, []);

  if (!experience) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-[15px] text-[#999] mb-4">experience not found.</p>
        <Link
          href="/"
          className="text-[13px] text-[#999] hover:text-[#1a1a1a] transition-colors"
        >
          back home
        </Link>
      </div>
    );
  }

  const navigationSections = (experience.sections ?? []).map((s) => ({
    key: s.id,
    title: s.title,
    anchor: getAnchor(s.id),
  }));

  const triggerHighlight = (anchor: string) => {
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    if (highlightFrameRef.current !== null)
      cancelAnimationFrame(highlightFrameRef.current);
    setHighlightedSection(null);
    highlightFrameRef.current = window.requestAnimationFrame(() => {
      setHighlightedSection({ id: anchor, token: Date.now() });
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedSection((cur) => (cur?.id === anchor ? null : cur));
      }, 1400);
    });
  };

  const focusSection = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el) return;
    if (manualSelectionTimeoutRef.current)
      clearTimeout(manualSelectionTimeoutRef.current);
    manualSelectionRef.current = anchor;
    setActiveSection(anchor);
    triggerHighlight(anchor);

    const r = el.getBoundingClientRect();
    const target =
      window.scrollY + r.top - (window.innerHeight - r.height) / 2;
    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });

    manualSelectionTimeoutRef.current = setTimeout(() => {
      manualSelectionRef.current = null;
      refreshActiveSectionRef.current();
    }, 900);
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    focusSection(anchor);
  };

  const contentsNav = (
    <div className="animate-fade-in delay-3">
      <p
        className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em] mb-4"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        contents
      </p>
      <ul className="flex flex-col gap-3">
        {navigationSections.map((section) => (
          <li key={section.key}>
            <a
              href={`#${section.anchor}`}
              onClick={(e) => handleNavClick(e, section.anchor)}
              className={`text-[14px] transition-colors duration-200 lowercase ${
                activeSection === section.anchor
                  ? "text-[#1a1a1a] font-medium"
                  : "text-[#bbb] hover:text-[#666]"
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 items-center bg-white min-h-screen">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="projects" />

        <main className="max-w-[1040px] mx-auto pb-16 pt-8">
          <div className="animate-fade-in delay-1">
            <p className="text-[13px] text-[#999] lowercase mb-3">
              experience · {experience.company}
            </p>
            <h1 className="text-[28px] md:text-[34px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1a1a1a] mb-8 lowercase">
              {experience.role}
            </h1>
          </div>

          {experience.image ? (
            <div className="animate-fade-in delay-2 mb-5">
              <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-lg">
                <Image
                  src={experience.image}
                  alt={experience.role}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="animate-fade-in delay-2 mb-12">
            {experience.date && (
              <p className="text-[14px] leading-[1.7] text-[#666] lowercase">
                timeline: {experience.date}
              </p>
            )}
            {experience.stack && experience.stack.length > 0 && (
              <p className="text-[14px] leading-[1.7] text-[#666] lowercase">
                tech stack: {experience.stack.join(", ")}
              </p>
            )}
          </div>

          <div className="relative flex gap-20">
            <div className="flex-1 min-w-0 pb-24">
              {(experience.sections ?? []).map((section, i) => {
                const anchor = getAnchor(section.id);
                return (
                  <section
                    key={section.id}
                    id={anchor}
                    className={`animate-fade-in delay-${Math.min(i + 3, 7)} mb-20 md:mb-24`}
                  >
                    <h2 className="text-[22px] md:text-[24px] font-bold text-[#1a1a1a] mb-5 lowercase">
                      <span
                        key={
                          highlightedSection?.id === anchor
                            ? `${anchor}-${highlightedSection.token}`
                            : anchor
                        }
                        className={
                          highlightedSection?.id === anchor
                            ? "section-title-flash"
                            : undefined
                        }
                      >
                        {section.title}
                      </span>
                    </h2>
                    {section.content.split(/\n{2,}/).map((p, pi) => (
                      <p
                        key={pi}
                        className="text-[16px] md:text-[17px] leading-[1.8] text-[#444] mb-5 last:mb-0"
                      >
                        {p}
                      </p>
                    ))}
                    {section.gallery && section.gallery.length > 0 && (
                      <div className="mt-6">
                        <ImageGallery items={section.gallery} />
                      </div>
                    )}
                    {section.link && (
                      <div className="mt-6">
                        <a
                          href={section.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] text-[14px] font-medium lowercase hover:bg-[#1a1a1a] hover:text-white transition-colors"
                        >
                          {section.link.label}
                        </a>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            <nav className="hidden lg:block sticky top-10 self-start w-[160px] shrink-0 pt-1">
              {contentsNav}
            </nav>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
