export type SkillLevel = "learning" | "comfortable" | "advanced";
export type SkillCategory = "frontend" | "backend" | "database" | "cloud" | "devops" | "tools";

export interface Skill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  color: string;
}

export const skills: Skill[] = [
  // Frontend
  { name: "JavaScript",   category: "frontend", level: "advanced",    color: "#F7DF1E" },
  { name: "TypeScript",   category: "frontend", level: "comfortable", color: "#3178C6" },
  { name: "React",        category: "frontend", level: "advanced",    color: "#61DAFB" },
  { name: "Next.js",      category: "frontend", level: "comfortable", color: "#ffffff" },
  { name: "Tailwind CSS", category: "frontend", level: "advanced",    color: "#06B6D4" },
  // Backend
  { name: "Node.js",      category: "backend",  level: "comfortable", color: "#68A063" },
  { name: "Express.js",   category: "backend",  level: "comfortable", color: "#aaaaaa" },
  { name: "REST APIs",    category: "backend",  level: "comfortable", color: "#FFB84D" },
  { name: "C++",          category: "backend",  level: "comfortable", color: "#00599C" },
  { name: "Java",         category: "backend",  level: "comfortable", color: "#ED8B00" },
  // Database
  { name: "MongoDB",      category: "database", level: "comfortable", color: "#4EA94B" },
  { name: "Mongoose",     category: "database", level: "comfortable", color: "#880000" },
  { name: "Supabase",     category: "database", level: "comfortable", color: "#3ECF8E" },
  { name: "PostgreSQL",   category: "database", level: "learning",    color: "#336791" },
  // Cloud
  { name: "Vercel",       category: "cloud",    level: "comfortable", color: "#F4F7FA" },
  { name: "AWS Basics",   category: "cloud",    level: "learning",    color: "#FF9900" },
  // DevOps
  { name: "Git",          category: "devops",   level: "advanced",    color: "#F05032" },
  { name: "GitHub",       category: "devops",   level: "advanced",    color: "#F4F7FA" },
  { name: "Docker",       category: "devops",   level: "learning",    color: "#2496ED" },
  { name: "Nginx",        category: "devops",   level: "learning",    color: "#009639" },
  // Tools
  { name: "VS Code",      category: "tools",    level: "advanced",    color: "#007ACC" },
  { name: "Figma",        category: "tools",    level: "comfortable", color: "#F24E1E" },
  { name: "Postman",      category: "tools",    level: "comfortable", color: "#FF6C37" },
];

export const skillCategories: { key: SkillCategory; label: string; icon: string }[] = [
  { key: "frontend", label: "Frontend",  icon: "⚛" },
  { key: "backend",  label: "Backend",   icon: "⚙" },
  { key: "database", label: "Database",  icon: "🗄" },
  { key: "cloud",    label: "Cloud",     icon: "☁" },
  { key: "devops",   label: "DevOps",    icon: "🐳" },
  { key: "tools",    label: "Tools",     icon: "🔧" },
];

export const levelColors: Record<SkillLevel, string> = {
  learning:    "#FFB84D",
  comfortable: "#2DE2E6",
  advanced:    "#68A063",
};

export const levelLabel: Record<SkillLevel, string> = {
  learning:    "Learning",
  comfortable: "Comfortable",
  advanced:    "Advanced",
};
