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
    subtitle: "Environmental Monitoring Platform",
    date: "2025",
    stack: ["React", "Node.js", "IoT", "Cloud"],
    image: "/canopi.png",
    imageStyle: "bottom",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Canopi is an environmental monitoring platform that collects and visualizes real-time data from distributed sensor networks. The system provides actionable insights for sustainability efforts through an intuitive dashboard interface.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "The platform consists of a React-based frontend dashboard that connects to a Node.js backend API. Sensor data is ingested through IoT protocols and stored in a time-series database, enabling real-time visualization and historical trend analysis.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The platform successfully demonstrates end-to-end environmental data collection, processing, and visualization with low-latency updates and a responsive user interface.",
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
          "A self-organizing mesh network built with ESP32 microcontrollers, enabling distributed sensor data collection across a wide area without relying on centralized Wi-Fi infrastructure.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "Each ESP32 node runs the ESP-MDF mesh networking stack, automatically discovering and connecting to neighboring nodes. Data is routed through the mesh to a root node that bridges to a standard Wi-Fi network and publishes sensor readings via MQTT.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The mesh network demonstrates reliable multi-hop communication between nodes with automatic topology recovery when nodes are added or removed from the network.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
