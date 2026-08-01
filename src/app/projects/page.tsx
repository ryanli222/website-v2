import type { Metadata } from "next";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { Footer } from "@/components/footer";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | Ryan Li",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="projects" />

        <main className="pb-16" aria-labelledby="projects-heading">
          <div className="mb-7 pt-2">
            <h1 id="projects-heading" className="text-[28px] font-light leading-tight text-[#1a1a1a]">
              Projects
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                category={project.date}
                image={project.image}
                imageStyle={project.imageStyle}
                priority={i === 0}
                delay={`delay-${Math.min(i + 1, 7)}`}
                href={`/projects/${project.slug}`}
              />
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
