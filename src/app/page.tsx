"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ExperienceCard } from "@/components/experience-card";
import { Footer } from "@/components/footer";
import { experiences } from "@/data/experience";

const featured = [
  { title: "Autonomous Wheelchair", category: "YHack 1st Place Hardware", image: "/chair.png", href: "/projects/autonomous-wheelchair" },
  { title: "Robotic Hand", category: "Projects", image: "/hand.png", href: "/projects/robotic-hand", hoverScale: 1.15 },
  { title: "Canopi", category: "Projects", image: "/canopi.png", href: "/projects/canopi" },
  { title: "Scroll Wizard", category: "Projects", image: "/projects/scroll-wizard/kynexa-card.png", href: "/projects/scroll-wizard" },
  { title: "Motion Camera", category: "Projects", image: "/cam icon.png", href: "/projects/motion-camera" },
];

// Slot layout is fixed; which project sits in which slot shuffles until first hover.
// Slots 0-2 stretch so the two top columns always end level.
const slotDelay = ["delay-2", "delay-3", "delay-4", "delay-5", "delay-6"];

export default function Home() {
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    if (frozen) return;
    const swap = () => {
      const a = Math.floor(Math.random() * order.length);
      let b = Math.floor(Math.random() * (order.length - 1));
      if (b >= a) b++;
      const next = [...order];
      [next[a], next[b]] = [next[b], next[a]];
      // ponytail: View Transitions animate the move where supported, else it just snaps
      if (document.startViewTransition) {
        document.startViewTransition(() => flushSync(() => setOrder(next)));
      } else {
        setOrder(next);
      }
    };
    // wait for the intro fade-in to finish before the first swap
    const t = setTimeout(swap, order.every((v, i) => v === i) ? 2800 : 2600);
    return () => clearTimeout(t);
  }, [order, frozen]);

  const freeze = () => setFrozen(true);
  const card = (slot: number) => {
    const p = featured[order[slot]];
    return (
      <ProjectCard
        key={slot}
        {...p}
        imageStyle="bottom"
        delay={slotDelay[slot]}
        onPointerEnter={freeze}
        style={{ viewTransitionName: `card-${order[slot]}`, flex: slot < 3 ? 1 : undefined } as React.CSSProperties}
      />
    );
  };

  return (
    <div className="flex flex-col flex-1 items-center bg-white">
      <div className="w-full max-w-[1500px] px-8 md:px-12 lg:px-16 xl:px-20">
        <Header />

        <main className="pb-16">
          {/* Two-column layout */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Left column - intro text */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              <Hero />
              {experiences.slice(0, 2).map((experience, index) => (
                <ExperienceCard
                  key={experience.slug}
                  role={experience.role}
                  company={experience.company}
                  image={experience.image}
                  delay={`delay-${index + 2}`}
                  href={experience.href}
                />
              ))}
              {card(2)}
            </div>

            {/* Right column - featured projects */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              {card(0)}
              {card(1)}
            </div>
          </div>

          {/* Full-width cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {card(3)}
            {card(4)}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
