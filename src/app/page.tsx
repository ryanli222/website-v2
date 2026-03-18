import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ExperienceCard } from "@/components/experience-card";
import { HobbyCard } from "@/components/hobby-card";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header />

        <main className="pb-16">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Left column - intro text, aligned with card tops */}
            <div className="lg:w-[48%]">
              <Hero />
            </div>

            {/* Right column - cards start at same level */}
            <div className="lg:w-[52%] flex flex-col gap-4 pt-2 lg:pt-0">
              <ProjectCard
                title="Canopi"
                category="Projects"
                delay="delay-2"
              />
              <ProjectCard
                title="Robotic Hand"
                category="Projects"
                delay="delay-3"
              />
            </div>
          </div>

          {/* Full-width cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ProjectCard
              title="Motion Camera"
              category="Projects"
              delay="delay-4"
            />
            <ProjectCard
              title="ESP32 Network"
              category="Projects"
              delay="delay-5"
            />
          </div>

          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ExperienceCard
              role="Firmware Engineer"
              company="UWFE"
              description="CAN bus communication, sensor integration, and real-time control loops for the electric race car."
              delay="delay-6"
            />
            <ExperienceCard
              role="Suspension"
              company="UWFE"
              description="Suspension geometry design and analysis for the mechanical performance of the vehicle."
              delay="delay-7"
            />
          </div>

          {/* Hobbies */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <HobbyCard
              title="Music"
              emoji="🎵"
              delay="delay-6"
            />
            <HobbyCard
              title="Anime"
              emoji="⛩️"
              delay="delay-7"
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
