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
            {/* Left column - intro text */}
            <div className="lg:w-[40%]">
              <Hero />
            </div>

            {/* Right column - featured project */}
            <div className="lg:w-[60%] flex flex-col gap-4 pt-2 lg:pt-0">
              <ProjectCard
                title="Autonomous Wheelchair"
                category="YHack 1st Place Hardware"
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
              title="ESP32 Network"
              category="Projects"
              image="/esp32.png"
              imageStyle="bottom"
              delay="delay-5"
              href="/projects/esp32-network"
            />
          </div>

          {/* Experience */}
          <div className="mt-4">
            <ExperienceCard
              role="Suspension + Firmware Engineer"
              company="UWFE"
              description="CAN bus communication, sensor integration, and real-time control loops for the electric race car. Suspension geometry design and analysis for the mechanical performance of the vehicle."
              image="/car.png"
              delay="delay-6"
            />
          </div>

          {/* Hobbies */}
          {false &&(
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
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
