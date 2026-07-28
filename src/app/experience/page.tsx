import { Header } from "@/components/header";
import { ExperienceCard } from "@/components/experience-card";
import { Footer } from "@/components/footer";
import { experiences } from "@/data/experience";

export default function ExperiencePage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header activeTab="experience" />

        <main className="pb-16">
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
