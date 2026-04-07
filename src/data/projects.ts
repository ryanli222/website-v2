export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  team?: { name: string; href?: string }[];
  stack: string[];
  links?: { label: string; href: string; icon?: "github" | "external" }[];
  image?: string;
  imageStyle?: "contain" | "bottom" | "overflow";
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: "canopi",
    title: "Canopi",
    subtitle: "Find your place. Not just an apartment.",
    date: "2025",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Gemini AI",
      "Mapbox GL",
      "Three.js",
      "Supabase",
      "Tailwind CSS",
      "ElevenLabs",
      "Vultr",
    ],
    image: "/canopi.png",
    imageStyle: "bottom",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Canopi is an AI-powered rental discovery platform that replaces traditional filters with conversation. Instead of searching by beds and price, users talk to an AI assistant that infers their lifestyle across 8 preference axes — walkability, nourishment, wellness, greenery, buzz, essentials, safety, and transit. A live radar chart updates in real time as the AI learns who you are, and the map re-ranks 200+ real Canadian listings to match your actual life, not just your budget. Each listing is enriched with nearby cafés, parks, gyms, groceries, transit stops, pharmacies, and schools within 1 km, and users can explore neighborhoods in a 3D diorama built with Three.js.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "The AI layer is built around structured JSON output from Google Gemini 2.5 Flash — every response returns both a natural language reply and a partial update to the 8-axis preference vector. The frontend merges these updates incrementally so the radar chart and listing rankings evolve fluidly as conversation develops. On the data side, we built a custom scraping and enrichment pipeline that deduplicates listings, normalizes inconsistent fields, geocodes addresses, and enriches each property with nearby amenity context from OpenStreetMap's Overpass API. The frontend is Next.js 16 with React 19 and TypeScript, the map runs on Mapbox GL 3, and the 3D diorama uses @react-three/fiber. Auth and persistence are handled by Supabase, voice I/O by ElevenLabs, and the backend runs on a Vultr cloud instance in Toronto secured with Tailscale.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "We shipped a fully working AI-to-map feedback loop — talk to the assistant, watch the map change. The platform serves 200+ real, enriched Canadian rental listings with smooth real-time re-ranking on every preference update. We also delivered voice input/output, French language support, a 3D neighborhood diorama, and Supabase-backed saved listings. The biggest challenge was data acquisition — rental platforms in Canada are fragmented and hostile to reuse, so we had to fight through inconsistent formats, missing fields, and freeform descriptions before we could even start on the product.",
      },
       {
        id: "try it out: ",
        title: "Try it Out",
        content:
          "canopi-ai.vercel.app",
      },
    ],
  },
  {
    slug: "robotic-hand",
    title: "Robotic Hand",
    subtitle: "Gesture-Controlled Prosthetic Prototype",
    date: "2025",
    stack: ["C++", "Arduino", "3D Printing", "Servo Motors"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "A gesture-controlled robotic hand built as a mechatronics project. The hand replicates human finger movements using servo motors driven by flex sensor inputs, demonstrating real-time biomechanical mapping.",
      },
      {
        id: "design",
        title: "Design & Build",
        content:
          "The mechanical structure was 3D printed with articulated joints connected via tendons to micro servo motors. An Arduino microcontroller reads analog signals from flex sensors worn on a glove and maps them to corresponding servo positions.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The prototype achieves accurate finger tracking with minimal latency, capable of replicating basic grip patterns and individual finger movements in real-time.",
      },
    ],
  },
  {
    slug: "motion-camera",
    title: "Motion Camera",
    subtitle: "Motion-Triggered Wildlife Camera",
    date: "2025",
    stack: ["Python", "Raspberry Pi", "OpenCV", "GPIO"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "A motion-triggered camera system built on Raspberry Pi that detects movement using computer vision and captures high-resolution images. Designed for wildlife monitoring and security applications.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "The system uses OpenCV for frame differencing to detect motion in real-time video streams. When motion exceeds a configurable threshold, the system captures and stores timestamped images. A PIR sensor provides hardware-level motion detection as a secondary trigger.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The camera system reliably detects and captures motion events with configurable sensitivity, running continuously on low power with efficient storage management.",
      },
    ],
  },
  {
    slug: "esp32-network",
    title: "ESP32 Network",
    subtitle: "Mesh Networking with ESP32 Microcontrollers",
    date: "2025",
    stack: ["C", "ESP-IDF", "Wi-Fi Mesh", "MQTT"],
    image: "/esp32.png",
    imageStyle: "overflow",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "",
      },
      {
        id: "results",
        title: "Results",
        content:
          "",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
