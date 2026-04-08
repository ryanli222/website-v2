import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { Footer } from "@/components/footer";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="projects" />

        <main className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                category={project.date}
                image={project.image}
                imageStyle={project.imageStyle}
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
