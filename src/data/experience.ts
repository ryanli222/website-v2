export interface Experience {
  slug: string;
  role: string;
  company: string;
  description: string;
  image?: string;
}

export const experiences: Experience[] = [
  {
    slug: "uwfe",
    role: "Suspension + Firmware Engineer",
    company: "UWFE",
    description:
      "CAN bus communication, sensor integration, and real-time control loops for the electric race car. Suspension geometry design and analysis for the mechanical performance of the vehicle.",
    image: "/car.png",
  },
];
