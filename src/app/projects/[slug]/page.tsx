"use client";

import type { MouseEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ModelViewer from "@/components/model-viewer";
import { useState, useEffect, useRef } from "react";

export default function ProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = getProjectBySlug(slug);

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
  const getSectionAnchor = (sectionId: string) =>
    sectionId
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const cadAnchor = "cad";

  useEffect(() => {
    if (!project) return;

    const sectionAnchors = [
      ...(project.slug === "robotic-hand" ? [cadAnchor] : []),
      ...project.sections.map((section) => getSectionAnchor(section.id)),
    ];

    const updateActiveSection = () => {
      if (manualSelectionRef.current) {
        setActiveSection(manualSelectionRef.current);
        return;
      }

      const sectionElements = sectionAnchors
        .map((anchor) => {
          const element = document.getElementById(anchor);
          return element ? { anchor, element } : null;
        })
        .filter((item): item is { anchor: string; element: HTMLElement } => item !== null);

      if (!sectionElements.length) {
        return;
      }

      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      if (pageHeight - scrollPosition <= 8) {
        const lastSection = sectionAnchors[sectionAnchors.length - 1];
        if (lastSection) {
          setActiveSection(lastSection);
        }
        return;
      }

      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestSection = sectionElements[0].anchor;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const { anchor, element } of sectionElements) {
        const rect = element.getBoundingClientRect();
        const sectionCenter = window.scrollY + rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = anchor;
        }
      }

      setActiveSection(closestSection);
    };

    refreshActiveSectionRef.current = updateActiveSection;

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      refreshActiveSectionRef.current = () => {};
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [project]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      if (highlightFrameRef.current !== null) {
        cancelAnimationFrame(highlightFrameRef.current);
      }

      if (manualSelectionTimeoutRef.current) {
        clearTimeout(manualSelectionTimeoutRef.current);
      }
    };
  }, []);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-[15px] text-[#999] mb-4">project not found.</p>
        <Link
          href="/"
          className="text-[13px] text-[#999] hover:text-[#1a1a1a] transition-colors"
        >
          back home
        </Link>
      </div>
    );
  }

  const normalizeExternalHref = (href: string) =>
    /^https?:\/\//i.test(href) ? href : `https://${href}`;
  const isRoboticHand = project.slug === "robotic-hand";
  const navigationSections = [
    ...(isRoboticHand ? [{ key: cadAnchor, title: "CAD", anchor: cadAnchor }] : []),
    ...project.sections.map((section) => ({
      key: section.id,
      title: section.title,
      anchor: getSectionAnchor(section.id),
    })),
  ];
  const triggerSectionHighlight = (sectionAnchor: string) => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    if (highlightFrameRef.current !== null) {
      cancelAnimationFrame(highlightFrameRef.current);
    }

    setHighlightedSection(null);

    highlightFrameRef.current = window.requestAnimationFrame(() => {
      setHighlightedSection({ id: sectionAnchor, token: Date.now() });
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedSection((current) => (current?.id === sectionAnchor ? null : current));
      }, 1400);
    });
  };
  const focusSection = (sectionAnchor: string) => {
    const sectionElement = document.getElementById(sectionAnchor);
    if (!sectionElement) return;

    if (manualSelectionTimeoutRef.current) {
      clearTimeout(manualSelectionTimeoutRef.current);
    }

    manualSelectionRef.current = sectionAnchor;
    setActiveSection(sectionAnchor);
    if (sectionAnchor !== cadAnchor) {
      triggerSectionHighlight(sectionAnchor);
    }

    const sectionRect = sectionElement.getBoundingClientRect();
    const targetScroll =
      sectionAnchor === cadAnchor
        ? window.scrollY + sectionRect.top
        : window.scrollY + sectionRect.top - (window.innerHeight - sectionRect.height) / 2;

    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: "smooth",
    });

    manualSelectionTimeoutRef.current = setTimeout(() => {
      manualSelectionRef.current = null;
      refreshActiveSectionRef.current();
    }, 900);
  };
  const handleContentsClick = (event: MouseEvent<HTMLAnchorElement>, sectionAnchor: string) => {
    event.preventDefault();
    focusSection(sectionAnchor);
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
        {navigationSections.map((section) => {
          return (
            <li key={section.key}>
              <a
                href={`#${section.anchor}`}
                onClick={(event) => handleContentsClick(event, section.anchor)}
                className={`text-[14px] transition-colors duration-200 lowercase ${
                  activeSection === section.anchor
                    ? "text-[#1a1a1a] font-medium"
                    : "text-[#bbb] hover:text-[#666]"
                }`}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
  const projectSections = (
    <>
      {project.sections.map((section, i) => {
        const sectionAnchor = getSectionAnchor(section.id);

        return (
          <section
            key={section.id}
            id={sectionAnchor}
            className={`animate-fade-in delay-${Math.min(i + 3, 7)} mb-20 md:mb-24`}
          >
            {section.title.toLowerCase() === "try it out" ? (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-5">
                <h2 className="text-[22px] md:text-[24px] font-bold text-[#1a1a1a] lowercase">
                  try it out! :
                </h2>
                <a
                  href={normalizeExternalHref(section.content)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] md:text-[17px] leading-[1.8] text-[#1a1a1a] underline decoration-[#ccc] underline-offset-2 hover:decoration-[#1a1a1a] transition-colors"
                >
                  {section.content}
                </a>
              </div>
            ) : (
              <>
                <h2 className="text-[22px] md:text-[24px] font-bold text-[#1a1a1a] mb-5 lowercase">
                  <span
                    key={
                      highlightedSection?.id === sectionAnchor
                        ? `${sectionAnchor}-${highlightedSection.token}`
                        : sectionAnchor
                    }
                    className={
                      highlightedSection?.id === sectionAnchor
                        ? "section-title-flash"
                        : undefined
                    }
                  >
                    {section.title}
                  </span>
                </h2>
                <p className="text-[16px] md:text-[17px] leading-[1.8] text-[#444]">
                  {section.content}
                </p>
              </>
            )}
          </section>
        );
      })}
    </>
  );

  return (
    <div className="flex flex-col flex-1 items-center bg-white min-h-screen">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="projects" />

        <main className="max-w-[720px] mx-auto pb-16 pt-8">
          <div className="animate-fade-in delay-1">
            <h1 className="text-[28px] md:text-[34px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1a1a1a] mb-8 lowercase">
              {project.title} - {project.subtitle}
            </h1>
          </div>

          {isRoboticHand ? (
            <div className="relative lg:flex lg:items-start lg:gap-10">
              <div className="min-w-0 flex-1 lg:max-w-[530px]">
                <section id={cadAnchor} className="scroll-mt-8">
                  <div className="animate-fade-in delay-2 mb-5 mx-auto lg:mx-0 max-w-[500px]">
                    <ModelViewer className="h-[430px] md:h-[565px] lg:h-[650px]" />
                  </div>

                  <div className="animate-fade-in delay-2 mb-12 lg:max-w-[500px]">
                    <p className="text-[14px] leading-[1.7] text-[#666] lowercase">
                      <span>timeline: {project.date}</span>
                      {project.team && (
                        <>
                          <span className="mx-1.5">&bull;</span>
                          <span>
                            team:{" "}
                            {project.team.map((member, i) => (
                              <span key={member.name}>
                                {member.href ? (
                                  <a
                                    href={member.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1a1a1a] underline decoration-[#ccc] underline-offset-2 hover:decoration-[#1a1a1a] transition-colors"
                                  >
                                    {member.name}
                                  </a>
                                ) : (
                                  member.name
                                )}
                                {i < project.team!.length - 1 && ", "}
                              </span>
                            ))}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-[14px] leading-[1.7] text-[#666] lowercase">
                      tech stack: {project.stack.join(", ")}
                    </p>
                  </div>
                </section>

                <div className="pb-24 lg:max-w-[500px]">{projectSections}</div>
              </div>

              <nav className="hidden lg:block sticky top-10 self-start w-[150px] shrink-0 pt-1">
                {contentsNav}
              </nav>
            </div>
          ) : (
            <>
              {project.image ? (
                <div className="animate-fade-in delay-2 mb-5">
                  <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="animate-fade-in delay-2 mb-12">
                <p className="text-[14px] leading-[1.7] text-[#666] lowercase">
                  <span>timeline: {project.date}</span>
                  {project.team && (
                    <>
                      <span className="mx-1.5">&bull;</span>
                      <span>
                        team:{" "}
                        {project.team.map((member, i) => (
                          <span key={member.name}>
                            {member.href ? (
                              <a
                                href={member.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1a1a1a] underline decoration-[#ccc] underline-offset-2 hover:decoration-[#1a1a1a] transition-colors"
                              >
                                {member.name}
                              </a>
                            ) : (
                              member.name
                            )}
                            {i < project.team!.length - 1 && ", "}
                          </span>
                        ))}
                      </span>
                    </>
                  )}
                </p>
                <p className="text-[14px] leading-[1.7] text-[#666] lowercase">
                  tech stack: {project.stack.join(", ")}
                </p>
              </div>

              <div className="relative flex gap-20">
                <div className="flex-1 min-w-0 pb-24">{projectSections}</div>

                <nav className="hidden lg:block sticky top-10 self-start w-[160px] shrink-0 pt-1">
                  {contentsNav}
                </nav>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
