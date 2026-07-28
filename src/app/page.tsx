import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ExperienceCard } from "@/components/experience-card";
import { Footer } from "@/components/footer";
import { experiences } from "@/data/experience";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header />

        <main className="pb-16">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Left column - intro text */}
            <div className="lg:w-[40%]">
              <Hero />
            </div>

            {/* Right column - featured project */}
            <div className="lg:w-[60%] flex flex-col gap-4 pt-2 lg:pt-0">
              <ProjectCard
                title="Autonomous Wheelchair"
                category="YHack 1st Place Hardware"
                image="/chair.png"
                imageStyle="bottom"
                delay="delay-2"
                href="/projects/autonomous-wheelchair"
              />
              <ProjectCard
                title="Robotic Hand"
                category="Projects"
                image="/hand.png"
                imageStyle="bottom"
                hoverScale={1.15}
                delay="delay-3"
                href="/projects/robotic-hand"
              />
            </div>
          </div>

          {/* Full-width cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ProjectCard
              title="Canopi"
              category="Projects"
              image="/canopi.png"
              imageStyle="bottom"
              delay="delay-4"
              href="/projects/canopi"
            />
            <ProjectCard
              title="Scroll Wizard"
              category="Projects"
              image="/projects/scroll-wizard/kynexa-card.png"
              imageStyle="bottom"
              delay="delay-5"
              href="/projects/scroll-wizard"
            />
          </div>

          {/* Experience */}
          <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {experiences.slice(0, 2).map((experience, index) => (
              <ExperienceCard
                key={experience.slug}
                role={experience.role}
                company={experience.company}
                description={experience.description}
                image={experience.image}
                delay={`delay-${Math.min(index + 6, 7)}`}
                href={experience.href}
              />
            ))}
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
}
