"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";

export default function ProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = getProjectBySlug(slug);

  const [activeSection, setActiveSection] = useState<string>("");
  const getSectionAnchor = (sectionId: string) =>
    sectionId
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    if (!project) return;

    const sectionAnchors = project.sections.map((section) => getSectionAnchor(section.id));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const section of project.sections) {
      const el = document.getElementById(getSectionAnchor(section.id));
      if (el) observer.observe(el);
    }

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      if (pageHeight - scrollPosition <= 8) {
        const lastSection = sectionAnchors[sectionAnchors.length - 1];
        if (lastSection) {
          setActiveSection(lastSection);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [project]);

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

  return (
    <div className="flex flex-col flex-1 items-center bg-white min-h-screen">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="projects" />

        <main className="max-w-[720px] mx-auto pb-16 pt-8">
          {/* title */}
          <div className="animate-fade-in delay-1">
            <h1 className="text-[28px] md:text-[34px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1a1a1a] mb-8 lowercase">
              {project.title} — {project.subtitle}
            </h1>
          </div>

          {/* cover image */}
          {project.image && (
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
          )}

          {/* metadata */}
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

          {/* content + toc sidebar */}
          <div className="relative flex gap-20">
            {/* main content */}
            <div className="flex-1 min-w-0 pb-24">
              {project.sections.map((section, i) => (
                <section
                  key={section.id}
                  id={getSectionAnchor(section.id)}
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
                        {section.title}
                      </h2>
                      <p className="text-[16px] md:text-[17px] leading-[1.8] text-[#444]">
                        {section.content}
                      </p>
                    </>
                  )}
                </section>
              ))}
            </div>

            {/* contents sidebar */}
            <nav className="hidden lg:block sticky top-10 self-start w-[160px] shrink-0 pt-1">
              <div className="animate-fade-in delay-3">
                <p
                  className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.12em] mb-4"
                  style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
                >
                  contents
                </p>
                <ul className="flex flex-col gap-3">
                  {project.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${getSectionAnchor(section.id)}`}
                        className={`text-[14px] transition-colors duration-200 lowercase ${
                          activeSection === getSectionAnchor(section.id)
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
            </nav>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
