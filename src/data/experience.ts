export type ExperienceGalleryItem = {
  src: string;
  alt?: string;
  caption?: string;
};

export type ExperienceSection = {
  id: string;
  title: string;
  content: string;
  gallery?: ExperienceGalleryItem[];
  link?: { label: string; href: string };
};

export interface Experience {
  slug: string;
  role: string;
  company: string;
  description: string;
  image?: string;
  date?: string;
  stack?: string[];
  sections?: ExperienceSection[];
}

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}

export const experiences: Experience[] = [
  {
    slug: "uwfe",
    role: "Suspension + Firmware Engineer",
    company: "UWFE",
    description:
      "CAN bus communication, sensor integration, and real-time control loops for the electric race car. Suspension geometry design and analysis for the mechanical performance of the vehicle.",
    image: "/car.png",
    date: "2025 — present",
    stack: ["C++", "Arduino", "CAN", "SolidWorks", "CNC Machining"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Dual-hat role on University of Waterloo Formula Electric — mechanical suspension work on one side, vehicle firmware on the other. Designed and machined a potentiometer mount for suspension travel sensing, and built out HIL (hardware-in-the-loop) infrastructure for safely iterating on the car's firmware off-vehicle.",
      },
      {
        id: "suspension",
        title: "Suspension",
        content:
          "Designed a potentiometer mount in SolidWorks that bolts to the upper A-arm pickup and rides against the shock body, giving us continuous suspension travel data over CAN for ride-height logging and setup tuning. The mount itself was straightforward — most of the work was on the manufacturing side. Machined the aluminum bracket on a 3-axis mill, including fixturing, tool pathing, and finishing to keep tolerances tight enough to clear the rotating shock without backlash in the sensor throw.",
        gallery: [
          {
            src: "/UWFE/mount.jpg",
            alt: "potentiometer mount",
            caption: "potentiometer mount",
          },
          {
            src: "/UWFE/bracket.jpg",
            alt: "machined bracket",
            caption: "machined aluminum bracket",
          },
          {
            src: "/UWFE/machining.jpg",
            alt: "machining",
            caption: "machining",
          },
          {
            src: "/UWFE/plate.jpg",
            alt: "plate",
            caption: "plate",
          },
        ],
      },
      {
        id: "firmware",
        title: "Firmware",
        content:
          "Built a hardware-in-the-loop rig that simulates CAN traffic from the car's ECUs so we can exercise new firmware paths without putting the car on the dyno. The HIL playback harness injects recorded bus traces, checks node responses against expected state transitions, and gates firmware PRs on a green test run. Source below.",
        link: {
          label: "HIL repo →",
          href: "https://github.com/UWaterloo-Formula-Electric/HIL",
        },
      },
    ],
  },
];
