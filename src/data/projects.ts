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
    image?: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: "autonomous-wheelchair",
    title: "Autonomous Wheelchair Attachment",
    subtitle: "YHack 1st Place Hardware — Self-Driving Wheelchair Add-On",
    date: "2026",
    stack: ["Python", "ROS", "LiDAR", "Raspberry Pi", "Computer Vision", "3D Printing"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "An autonomous navigation attachment that bolts onto any standard wheelchair, giving it self-driving capabilities without replacing the chair itself. Built in 24 hours at YHack and awarded 1st place in the hardware track. The system uses LiDAR and computer vision to map its surroundings, plan obstacle-free paths, and drive the wheelchair to a user-selected destination.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "A Raspberry Pi serves as the main compute unit, fusing data from a 2D LiDAR scanner and a camera running a lightweight object-detection model. The navigation stack handles SLAM-based mapping, path planning, and motor control through a custom drive module that interfaces with the wheelchair's wheels. The entire attachment is designed to be removable — it clamps onto the frame and connects to the wheels through a friction-drive mechanism, so the wheelchair can still be used manually at any time.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The prototype successfully navigated an indoor course at YHack, avoiding static and dynamic obstacles in real time. Judges awarded it 1st place in the hardware category for the combination of practical impact, technical execution, and the fact that it augments existing wheelchairs rather than replacing them.",
      },
    ],
  },
  {
    slug: "canopi",
    title: "Canopi",
    subtitle: "Find your place. Not just an apartment.",
    date: "2026",
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
    date: "2026",
    stack: ["C++", "Arduino", "3D Printing", "Servo Motors"],
    image: "/hand.png",
    imageStyle: "bottom",
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
    subtitle: "Smart Doorbell & Motion-Triggered Camera System",
    date: "2026",
    stack: ["Python", "Raspberry Pi", "OpenCV", "GPIO", "SQLite", "Flask"],
    image: "/cam icon.png",
    imageStyle: "bottom",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "A smart doorbell and motion-triggered camera system built on Raspberry Pi. When motion is detected — whether someone approaching the door or wildlife passing through — the system captures high-resolution images, logs them to a local SQLite database with timestamps and motion metadata, and serves them through a lightweight web dashboard for browsing the capture history.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "The system uses OpenCV frame differencing to detect motion in real-time video streams. A PIR sensor provides hardware-level motion detection as a secondary trigger, reducing false positives. When motion exceeds a configurable threshold the camera captures a burst of images, which are stored on disk and indexed in a SQLite database alongside timestamp, motion intensity, and bounding-box coordinates. A Flask web server exposes a simple dashboard where you can browse, filter, and review the picture database — essentially a doorbell camera you fully own and control.",
        image: "/opencv cam demo.png",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The system runs 24/7 on a Raspberry Pi 4, reliably capturing and cataloguing motion events with configurable sensitivity. The picture database grows automatically and can be browsed from any device on the local network. Low power consumption and efficient storage management make it practical as a long-running doorbell camera or wildlife monitor.",
        image: "/doorbell data.png",
      },
    ],
  },
  {
    slug: "esp32-network",
    title: "ESP32 Network",
    subtitle: "ESP32-Based Smart Home Hub",
    date: "2025",
    stack: ["C", "ESP-IDF", "Wi-Fi Mesh", "MQTT", "Node.js", "WebSockets"],
    image: "/esp32.png",
    imageStyle: "overflow",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "A home automation hub built around a mesh network of ESP32 microcontrollers. Each node handles a different task — temperature and humidity sensing, relay-controlled lighting, door/window contact monitoring, and motion detection — while a central Node.js server aggregates data, serves a real-time dashboard, and lets you control everything from your phone.",
        image: "/inside of node.jpg",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "The ESP32 nodes form a self-healing Wi-Fi mesh using ESP-MDF, so adding a new sensor to a room is just plugging in another board. Each node publishes sensor readings and subscribes to control commands over MQTT. The central hub runs a Node.js server that bridges MQTT to a WebSocket-powered dashboard — sensor data streams in live, and toggling a light or setting a thermostat threshold pushes a command back down to the right node instantly. All telemetry is logged to a time-series store for historical graphs.",
        image: "/espdata.png",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The network reliably coordinates multiple ESP32 nodes across a house with sub-second latency between sensor events and dashboard updates. The mesh topology handles node drops gracefully, and the system has been running continuously as a fully self-hosted smart home setup — no cloud dependencies, no subscriptions, complete local control.",
      },
    ],
  },
  {
    slug: "vex-drawing-robot",
    title: "VEX Drawing Robot",
    subtitle: "Autonomous Image-Tracing Robot",
    date: "2026",
    stack: ["C++", "VEX V5", "Python", "OpenCV", "Path Planning"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "A VEX robotics platform repurposed into an autonomous drawing machine. Given any input image, the robot converts it into a series of pen strokes and physically draws it on paper using a custom pen-holder mechanism mounted to the drivetrain.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "A Python preprocessing pipeline takes an input image, applies edge detection and contour extraction with OpenCV, then converts the contours into an optimized sequence of waypoints using a nearest-neighbor path planner to minimize pen-up travel time. The waypoints are sent to the VEX V5 brain over serial, which executes them as coordinated motor movements. A servo-actuated pen holder lifts and lowers the pen between strokes, and odometry feedback keeps the drawing aligned across the full page.",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The robot reproduces recognizable line drawings from photographs, handling curves, fine detail, and large fills. Draw time depends on image complexity — simple logos take a few minutes, detailed portraits up to fifteen.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
