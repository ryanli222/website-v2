export type ArchitectureDiagramData = {
  groups: {
    id: string;
    label: string;
    nodes: { id: string; label: string }[];
    cols?: number;
  }[];
  edges: {
    from: string;
    to: string;
    dashed?: boolean;
    label?: string;
  }[];
};

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
  imageFull?: boolean;
  sections: {
    id: string;
    title: string;
    content: string;
    image?: string | string[];
    architecture?: ArchitectureDiagramData;
    nodeDetails?: Record<string, { title: string; body: string }>;
  }[];
}

export const projects: Project[] = [
  {
    slug: "autonomous-wheelchair",
    title: "Autonomous Wheelchair Attachment",
    subtitle: "YHack 1st Place Hardware — Self-Driving Wheelchair Add-On",
    date: "2026",
    image: "/chair.png",
    imageStyle: "bottom",
    stack: [
      "Python",
      "Arduino C++",
      "LD19 LiDAR",
      "ElevenLabs Voice",
      "Anthropic LLM",
      "A* + DWA",
      "Computer Vision",
      "Viam",
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "An autonomous navigation attachment that bolts onto any standard wheelchair and takes natural-language commands. The user speaks (\"take me to the door\"), an LLM parses the goal into a coordinate, and an A* planner with DWA + potential-field local control drives the chair there on four mecanum wheels while a 4-layer spatial memory learns the space across trips. Built in 24 hours at YHack and awarded 1st place in the hardware track.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "The system runs as three concurrent loops on a laptop tethered to an Arduino Mega over USB serial.\n\nThe voice loop captures speech through ElevenLabs STT (with Whisper as a fallback), passes the text to an Anthropic LLM that returns structured goto commands, and speaks responses back through ElevenLabs TTS. The planning loop runs at 10–20 Hz: it takes the goal, runs A* over a blended costmap pulled from a 4-layer spatial memory (static occupancy from LiDAR raycasting, an ORB-feature landmark database, dynamic obstacle priors learned across trips, and a learned traversal cost map), then feeds the global path through a DWA + potential-field local planner and a jerk-limited velocity smoother. The motor loop on the Mega runs at 50–100 Hz: it takes vx/vy/ω velocity commands as line-delimited JSON over serial at 115200 baud, applies mecanum inverse kinematics (FL = vx − vy − ω, etc.), and outputs PWM through four VNH5019 motor drivers.\n\nThe attachment clamps onto the wheelchair frame and connects to the wheels through a friction-drive mechanism, so the chair can still be used manually at any time.",
        image: ["/lidar.png", "/viam.png"],
        architecture: {
          groups: [
            {
              id: "VOICE",
              label: "voice command",
              cols: 3,
              nodes: [
                { id: "MIC", label: "microphone" },
                { id: "STT", label: "ElevenLabs\nSTT" },
                { id: "LLM", label: "Anthropic\nLLM" },
              ],
            },
            {
              id: "SENSORS",
              label: "sensors",
              cols: 2,
              nodes: [
                { id: "LIDAR", label: "LD19 LiDAR\n2D, 10 Hz" },
                { id: "CAMS", label: "Webcam" },
              ],
            },
            {
              id: "LAPTOP",
              label: "laptop · Python",
              cols: 4,
              nodes: [
                { id: "MEM", label: "Spatial memory\n4 layers" },
                { id: "ASTAR", label: "A* global\nplanner" },
                { id: "DWA", label: "DWA + PF\nlocal" },
                { id: "SMOOTH", label: "Velocity\nsmoother" },
              ],
            },
            {
              id: "DRIVE",
              label: "drive · Arduino Mega @ 50–100 Hz",
              cols: 3,
              nodes: [
                { id: "ARD", label: "Mega\nMecanum IK" },
                { id: "VNH", label: "4× VNH5019\ndrivers" },
                { id: "WHEELS", label: "Mecanum\nwheels" },
              ],
            },
          ],
          edges: [
            { from: "MIC", to: "STT" },
            { from: "STT", to: "LLM" },
            { from: "LLM", to: "ASTAR", label: "goto x,y" },
            { from: "LIDAR", to: "MEM" },
            { from: "LIDAR", to: "DWA", dashed: true, label: "hard-stop" },
            { from: "CAMS", to: "MEM" },
            { from: "MEM", to: "ASTAR", label: "costmap" },
            { from: "ASTAR", to: "DWA" },
            { from: "DWA", to: "SMOOTH" },
            { from: "SMOOTH", to: "ARD", label: "JSON / 115200" },
            { from: "ARD", to: "VNH" },
            { from: "VNH", to: "WHEELS" },
          ],
        },
        nodeDetails: {
          MIC: {
            title: "Microphone",
            body: "Laptop-side audio capture. Push-to-talk input that buffers the audio chunk and pipes it into the STT service. Voice is the primary input modality — the chair has no joystick or screen, only a microphone and a button.",
          },
          STT: {
            title: "ElevenLabs STT",
            body: "Speech-to-text via ElevenLabs over the network. Whisper runs as a local fallback if the network drops. Latency is ~500 ms for a short utterance, which is fast enough that the LLM-to-action loop feels conversational.",
          },
          LLM: {
            title: "Anthropic LLM",
            body: "Receives the transcribed utterance plus a list of named waypoints set at the venue (door, table, window) and returns structured JSON: { cmd: 'goto', x, y } plus a spoken response. A regex fallback handles common phrasings if the API is down.",
          },
          LIDAR: {
            title: "LD19 LiDAR",
            body: "2D spinning LiDAR at 10 Hz over a binary protocol with CRC. Provides 360° range data used for occupancy raycasting (Bayesian log-odds) into the spatial memory and for emergency hard-stops if any cluster comes within 30 cm of the chair.",
          },
          CAMS: {
            title: "Webcam",
            body: "A single USB webcam mounted on the chair. ORB feature extraction runs on each frame; matched features feed the landmark database in spatial memory. Depth comes from a vertical-position heuristic — pixel y-coordinate maps to a rough distance — which is good enough to flag dynamic obstacles in the planner's costmap.",
          },
          MEM: {
            title: "Spatial memory · 4 layers",
            body: "5 cm grid resolution, persisted to disk between runs. Layer 1 is a Bayesian static-occupancy grid, layer 2 is an ORB landmark database (descriptors + map coords), layer 3 is per-cell dynamic obstacle priors learned via EMA, layer 4 is a traversal-success cost map. A CostCompositor blends all four into the costmap A* uses.",
          },
          ASTAR: {
            title: "A* global planner",
            body: "Plans a collision-free route from the current pose to the LLM-supplied goal over the blended costmap. Replans when the costmap changes significantly or the local planner gets stuck. Uses 8-connectivity with diagonal-move penalties.",
          },
          DWA: {
            title: "DWA + potential field",
            body: "Dynamic Window Approach generates candidate (vx, vy, ω) trajectories within the chair's velocity/acceleration limits and scores them by goal heading, clearance, and progress. A potential-field repulsion term pushes harder away from close LiDAR returns. Runs at 10–20 Hz.",
          },
          SMOOTH: {
            title: "Velocity smoother",
            body: "Limits acceleration to 0.5 m/s² and jerks above that, so the chair never lurches. Output is the actual command sent to the Mega over serial. A 500 ms watchdog kills motors if the laptop goes silent.",
          },
          ARD: {
            title: "Arduino Mega · Mecanum IK",
            body: "Runs the inner control loop at 50–100 Hz. Receives line-delimited JSON velocity commands at 115200 baud, applies mecanum inverse kinematics (FL = vx − vy − ω, FR = vx + vy + ω, RL = vx + vy − ω, RR = vx − vy + ω), and outputs PWM. Reads encoders and current sense for stall detection. E-stop is a hardware interrupt directly on the Mega.",
          },
          VNH: {
            title: "4× VNH5019 drivers",
            body: "One H-bridge driver per motor — independent breakouts rather than a shared shield, so a fault on one wheel doesn't take down the rest. Drivers handle direction and PWM duty from the Mega; current is read on A0–A3 for stall detection.",
          },
          WHEELS: {
            title: "Mecanum wheels",
            body: "Four mecanum wheels in an X layout give true omnidirectional motion — strafe, translate, and rotate simultaneously. Each wheel has angled rollers at 45° so lateral force components combine for sideways travel. Each is driven by a brushed DC motor with a quadrature encoder.",
          },
        },
      },
      {
        id: "motor-control",
        title: "Motor Control",
        content:
          "The Arduino Mega 2560 runs the inner control loop at 50–100 Hz. It receives line-delimited JSON velocity commands (vx, vy, ω) over USB serial at 115200 baud, applies mecanum inverse kinematics to compute four wheel speeds, and outputs PWM through four VNH5019 H-bridge drivers (one per motor). A 500 ms serial watchdog stops the motors if the laptop goes silent, an e-stop button hardware-interrupts the Mega for instant zero-velocity, and current sense on A0–A3 catches motor stalls. Try it below — use WASD to drive and E/F to rotate. The code updates live with the actual IK math running on the Mega.",
        image: "/wired.jpg",
      },
      {
        id: "results",
        title: "Results",
        content:
          "The prototype successfully navigated an indoor course at YHack, taking voice commands and reaching named waypoints while avoiding static and dynamic obstacles in real time. Judges awarded it 1st place in the hardware category for the combination of practical impact, technical execution, and the fact that it augments existing wheelchairs rather than replacing them. The biggest open gap was pose estimation — the demo ran on dead-reckoning with LiDAR scan-matching as a guard, and proper EKF fusion of LiDAR, encoders, and visual odometry is the next milestone.",
        image: "/win.png",
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
    imageFull: true,
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Canopi is an AI-powered rental discovery platform that replaces traditional filters with conversation. Instead of searching by beds and price, users talk to an AI assistant that infers their lifestyle across 8 preference axes — walkability, nourishment, wellness, greenery, buzz, essentials, safety, and transit. A live radar chart updates in real time as the AI learns who you are, and the map re-ranks 200+ real Canadian listings to match your actual life, not just a checkbox of constraints.",
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content:
          "Canopi is built on three connected systems. A data pipeline scrapes 200+ rental listings from RentFaster, geocodes each address through Nominatim, and enriches it with nearby amenities from the Overpass API — cafés, gyms, parks, schools, pharmacies, transit — counted inside a 1 km radius. Gemini 2.5 Flash normalizes the messy listing text into a consistent schema.\n\nAt runtime, an AI chat layer drives the experience. A Next.js API route sends each user message to Gemini with a system prompt that forces structured JSON output: a natural-language reply, a delta across the 8 lifestyle axes, and a ranked list of matching listing IDs. The chat asks indirect, personality-revealing questions — \"what does a good Sunday morning look like?\" — instead of interrogating the user about square footage.\n\nThe frontend ties it together. A Mapbox GL map renders price pins and flies to AI-recommended listings, a hand-rolled SVG radar chart animates as preferences shift, and a Three.js diorama renders a 3D neighborhood vitality view for any selected property. Supabase handles auth and persists saved listings, and ElevenLabs adds optional voice input/output in English and French. The backend runs on a Vultr cloud instance in Toronto, secured with Tailscale.",
        image: "/listings.png",
      },
      {
        id: "architecture",
        title: "Architecture",
        content:
          "The pipeline, AI layer, and frontend are loosely coupled through a small set of Next.js API routes. Offline scraping and enrichment produce a single static JSON artifact; at runtime, chat messages flow into Gemini and come back out as structured preference deltas that drive the map and radar chart.",
        architecture: {
          groups: [
            {
              id: "PIPE",
              label: "offline data pipeline",
              cols: 5,
              nodes: [
                { id: "RF", label: "RentFaster\nscraper" },
                { id: "NOM", label: "Nominatim\ngeocoding" },
                { id: "OVP", label: "Overpass API\namenities · 1km" },
                { id: "GEM1", label: "Gemini 2.5\nnormalize schema" },
                { id: "JSON", label: "combined.json\n200+ listings" },
              ],
            },
            {
              id: "AI",
              label: "AI layer",
              cols: 2,
              nodes: [
                {
                  id: "GEM2",
                  label: "Gemini 2.5 Flash\nstructured JSON\nreply + prefs + ids",
                },
                { id: "EL", label: "ElevenLabs\nSTT / TTS" },
              ],
            },
            {
              id: "API",
              label: "Next.js API routes",
              cols: 4,
              nodes: [
                { id: "RL", label: "/api/listings" },
                { id: "RV", label: "/api/vitality" },
                { id: "RC", label: "/api/chat" },
                { id: "RS", label: "/api/stt · /api/tts" },
              ],
            },
            {
              id: "FE",
              label: "frontend · React 19",
              cols: 4,
              nodes: [
                { id: "CHAT", label: "chat panel" },
                { id: "SPIDER", label: "8-axis radar\nSVG" },
                { id: "MAP", label: "Mapbox GL\nprice pins" },
                { id: "DIO", label: "Three.js diorama\nR3F + shaders" },
              ],
            },
            {
              id: "INFRA",
              label: "auth & hosting",
              cols: 2,
              nodes: [
                { id: "SUPA", label: "Supabase\nauth + saved listings" },
                { id: "HOST", label: "Vercel / Vultr" },
              ],
            },
          ],
          edges: [
            { from: "RF", to: "NOM" },
            { from: "NOM", to: "OVP" },
            { from: "OVP", to: "GEM1" },
            { from: "GEM1", to: "JSON" },
            { from: "JSON", to: "RL" },
            { from: "OVP", to: "RV", dashed: true, label: "live" },
            { from: "GEM2", to: "RC" },
            { from: "EL", to: "RS" },
            { from: "RL", to: "MAP" },
            { from: "RV", to: "MAP" },
            { from: "RC", to: "CHAT" },
            { from: "RS", to: "CHAT" },
            { from: "CHAT", to: "SPIDER" },
            { from: "CHAT", to: "MAP" },
            { from: "MAP", to: "DIO" },
          ],
        },
        nodeDetails: {
          RF: {
            title: "RentFaster scraper",
            body: "A Node scraper paginates through RentFaster search results across Canadian cities, extracts each listing's address, price, bed/bath counts, square footage, photos, and description, then writes everything to a raw JSON file. Deduplicates by listing ID before moving downstream.",
          },
          NOM: {
            title: "Nominatim geocoding",
            body: "Each listing's street address is sent to Nominatim (OpenStreetMap's free geocoder) to resolve lat/lng. Results are cached on disk so rerunning the pipeline is cheap, and a rate limiter keeps us under Nominatim's 1 request/second policy.",
          },
          OVP: {
            title: "Overpass amenities",
            body: "For every geocoded listing, we query the Overpass API for 7 categories of nearby amenities — cafés, gyms, parks, groceries, pharmacies, schools, transit stops — within a 1 km radius. The counts become the raw inputs to the 8-axis lifestyle scoring that powers the radar chart.",
          },
          GEM1: {
            title: "Gemini schema normalization",
            body: "Rental descriptions are freeform prose. We pass each listing through Gemini 2.5 Flash with a strict JSON schema, extracting structured fields (pets allowed, parking, utilities included, furnished, availability date) even when the source text is inconsistent or missing fields entirely.",
          },
          JSON: {
            title: "combined.json",
            body: "The final build artifact — 200+ listings, each with coordinates, structured fields, and amenity counts. Checked into the repo and served statically, so the map loads instantly without an upstream call on every pageview.",
          },
          RL: {
            title: "/api/listings",
            body: "Simple Next.js route handler that reads combined.json and returns the listing array to the frontend. Applies lightweight filtering and sorting server-side so the client doesn't have to download everything when a user narrows the map.",
          },
          RV: {
            title: "/api/vitality",
            body: "Live Overpass proxy — when a user opens a listing we don't have cached amenity data for, this route queries Overpass on-demand with a 5-minute TTL cache and request deduplication so burst clicks don't fan out into duplicate upstream calls.",
          },
          RC: {
            title: "/api/chat",
            body: "The heart of the AI loop. Receives the full conversation history, calls Gemini with a system prompt that enforces structured JSON output, then returns three things in one payload: a natural-language reply, a delta across the 8 preference axes, and a ranked list of matching listing IDs.",
          },
          RS: {
            title: "/api/stt · /api/tts",
            body: "Thin wrappers around ElevenLabs speech-to-text and text-to-speech. Users can hold a button to dictate, and Canopi's replies can be spoken back in English or French — same Gemini pipeline, just a different I/O modality.",
          },
          GEM2: {
            title: "Gemini 2.5 Flash (runtime)",
            body: "Google's fast multimodal model. We use its structured output mode to force a rigid JSON schema on every response — no regex parsing, no hallucinated field names. The system prompt instructs it to ask indirect, lifestyle-revealing questions rather than interrogating the user about square footage.",
          },
          EL: {
            title: "ElevenLabs voice",
            body: "Handles bilingual STT and TTS. Voice input lets users talk to Canopi like a real assistant; voice output makes the recommendation feel more like a conversation with a concierge than a chat UI. Optional — chat works identically without it.",
          },
          CHAT: {
            title: "Chat panel",
            body: "The conversational entry point. Renders the message thread, streams Gemini's reply, applies the preference delta to shared React context (which drives the radar chart), and highlights recommended listings on the map in real time.",
          },
          SPIDER: {
            title: "8-axis radar chart",
            body: "Hand-rolled SVG radar that visualizes the current preference vector across walkability, nourishment, wellness, greenery, buzz, essentials, safety, and transit. Animates smoothly as chat updates come in, so the user can literally watch the AI learning them.",
          },
          MAP: {
            title: "Mapbox GL map",
            body: "Renders 200+ price pins across Canada. When the AI recommends specific listings, the map flies to each one and pulses the marker. Clicking a pin opens an enriched listing card with amenity scores, neighborhood context, and the option to dive into the 3D diorama.",
          },
          DIO: {
            title: "Three.js diorama",
            body: "A React Three Fiber scene that renders a stylized 3D view of the neighborhood around a selected listing — buildings, parks, transit, and amenity density as spatial volumes. Uses custom GLSL shaders for a neon-tether aesthetic and bloom post-processing for the glow.",
          },
          SUPA: {
            title: "Supabase",
            body: "Handles auth (email + Google OAuth) and persists each user's saved listings. A Postgres-backed row-level-secured table means users only ever see their own bookmarks, with no backend code to write.",
          },
          HOST: {
            title: "Vercel / Vultr",
            body: "Frontend and serverless API routes deploy to Vercel; the backend enrichment worker and heavier Overpass queries run on a Vultr cloud instance in Toronto, secured with Tailscale so only the Vercel functions can reach it.",
          },
        },
      },
      {
        id: "results",
        title: "Results",
        content:
          "We shipped a fully working AI-to-map feedback loop — talk to the assistant, watch the map change. The platform serves 200+ real, enriched Canadian rental listings with smooth sub-second re-ranking on every preference update, a hand-rolled 8-axis radar chart that animates as the AI learns you, voice input/output, French language support, a 3D neighborhood diorama, and Supabase-backed saved listings. The biggest challenge was data acquisition — rental platforms in Canada are fragmented and hostile to reuse, so we had to fight through inconsistent formats, missing fields, and freeform descriptions before we could even start on the product.",
        image: "/three%20js.png",
      },
      {
        id: "try-it-out",
        title: "Try it Out",
        content: "canopi-ai.vercel.app",
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
