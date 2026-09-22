export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  features: string[];
  architecture: { layer: string; tech: string; role: string }[];
  challenges: string[];
  github: string;
  live: string;
  color: string;
  accentColor: string;
  status: "live" | "wip" | "complete";
}

export const projects: Project[] = [
  {
    id: "campus-delivery",
    number: "01",
    title: "Campus Delivery",
    description: "Full-stack campus food delivery and transportation management ecosystem.",
    longDescription:
      "A comprehensive campus-wide platform connecting students, food vendors, and riders. Real-time order tracking, geofenced checkpoints, bus request flows, and integrated payment workflows — built for scale and reliability.",
    tech: ["React", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Mongoose"],
    features: [
      "Food ordering with vendor management",
      "Rider assignment & live tracking",
      "Campus bus request system",
      "Day scholar transportation flow",
      "Checkpoint-based geofenced notifications",
      "Driver delay notification system",
    ],
    architecture: [
      { layer: "Client", tech: "React + Tailwind CSS", role: "SPA UI, real-time updates" },
      { layer: "API", tech: "Node.js + Express.js", role: "REST API, auth, business logic" },
      { layer: "Database", tech: "MongoDB + Mongoose", role: "Orders, users, routes, riders" },
      { layer: "Realtime", tech: "WebSocket / polling", role: "Live order & location updates" },
      { layer: "Notifications", tech: "Server-sent events", role: "Checkpoint & delay alerts" },
    ],
    challenges: [
      "Designing geofence logic for campus checkpoints",
      "Managing real-time state across rider and student views",
      "Handling concurrent orders with reliable status transitions",
    ],
    github: "https://github.com/ashis2489/campus-delivery",
    live: "https://campus-delivery-demo.vercel.app",
    color: "#2DE2E6",
    accentColor: "#1ab8bb",
    status: "complete",
  },
  {
    id: "disha-for-india",
    number: "02",
    title: "Disha for India",
    description: "Teen-focused support and wellness platform for mental health awareness.",
    longDescription:
      "A safe digital space designed for Indian teenagers to access mental health resources, community support, and wellness tools. Features anonymous forums, guided exercises, professional matching, and crisis resources.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    features: [
      "Teen support resources & guides",
      "Parent awareness section",
      "Wellness content library",
      "Professional appointment booking",
      "Safe anonymous community forum",
      "Responsive mobile-first design",
    ],
    architecture: [
      { layer: "Client", tech: "Next.js + TypeScript", role: "SSR/SSG, accessible UI" },
      { layer: "Backend", tech: "Supabase", role: "Auth, database, storage, realtime" },
      { layer: "Database", tech: "PostgreSQL (Supabase)", role: "Users, content, appointments" },
      { layer: "Auth", tech: "Supabase Auth", role: "Secure anonymous + social login" },
      { layer: "Hosting", tech: "Vercel", role: "Edge deployment, CDN" },
    ],
    challenges: [
      "Building truly safe anonymous posting without abuse vectors",
      "Designing for young users — clear, calm, non-clinical UX",
      "Content moderation architecture at launch scale",
    ],
    github: "https://github.com/ashis2489/disha-for-india",
    live: "https://disha-for-india.vercel.app",
    color: "#FFB84D",
    accentColor: "#e6a030",
    status: "live",
  },
  {
    id: "nirogitanman",
    number: "03",
    title: "Nirogitanman",
    description: "Premium digital experience for an authentic Ayurvedic wellness brand.",
    longDescription:
      "A beautifully crafted e-commerce and wellness platform for an Ayurvedic brand. Features product catalogues, personalized wellness assessments, subscription management, and a curated content blog.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    features: [
      "Premium product catalogue & detail pages",
      "Personalized Ayurvedic wellness assessment",
      "Subscription & order management",
      "Curated Ayurveda blog & knowledge base",
      "Secure checkout flow",
      "Admin content dashboard",
    ],
    architecture: [
      { layer: "Client", tech: "Next.js + TypeScript", role: "SSR product pages, SEO optimized" },
      { layer: "Backend", tech: "Supabase", role: "Products, orders, blog, user data" },
      { layer: "Database", tech: "PostgreSQL (Supabase)", role: "Catalogue, subscriptions, content" },
      { layer: "Auth", tech: "Supabase Auth", role: "Customer accounts, admin roles" },
      { layer: "Hosting", tech: "Vercel", role: "Edge, image optimization, CDN" },
    ],
    challenges: [
      "Building performant SSR pages for SEO and product discovery",
      "Designing a premium feel with Tailwind alone — no UI library",
      "Subscription + one-time purchase logic in the same cart",
    ],
    github: "https://github.com/ashis2489/nirogitanman",
    live: "https://nirogitanman.vercel.app",
    color: "#A8E6CF",
    accentColor: "#7fcba5",
    status: "live",
  },
];
