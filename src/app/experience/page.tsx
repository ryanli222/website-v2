import type { Metadata } from "next";
import { Header } from "@/components/header";
import { ExperienceCard } from "@/components/experience-card";
import { Footer } from "@/components/footer";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience | Ryan Li",
};

export default function ExperiencePage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="experience" />

        <main className="pb-16" aria-labelledby="experience-heading">
          <div className="mb-7 pt-2">
            <h1 id="experience-heading" className="text-[28px] font-light leading-tight text-[#1a1a1a]">
              Experience
            </h1>
          </div>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {experiences.map((exp, i) => (
              <ExperienceCard
                key={exp.slug}
                role={exp.role}
                company={exp.company}
                description={exp.description}
                image={exp.image}
                delay={`delay-${Math.min(i + 1, 7)}`}
                href={exp.href}
              />
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
