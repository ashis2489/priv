export const summary =
  "Computer Science student and aspiring Product Engineer who enjoys turning ideas into practical, " +
  "user-focused products. I enjoy building across the stack, creating responsive interfaces and " +
  "solving real-world problems with modern web technologies. Curious, hands-on, and always learning, " +
  "I'm focused on growing as an engineer while creating simple, meaningful experiences through technology.";

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export const education: Education[] = [
  {
    degree: "B.Tech — Computer Science & Engineering",
    school: "Geeta University, Panipat",
    period: "2023 – Present",
  },
];

export const coursework = [
  "Data Structures & Algorithms",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Cloud Computing",
];

export interface Experience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export const experience: Experience[] = [
  {
    role: "Web Development Intern",
    company: "TalentGro Global",
    period: "Jun 2026 – Aug 2026",
    bullets: [
      "Built responsive frontend features using HTML, CSS, JavaScript, and React.js.",
      "Developed reusable UI components with clean, maintainable code.",
      "Contributed to user-focused interface improvements and responsive experiences.",
      "Used Git/GitHub for version control and collaborative development.",
    ],
  },
  {
    role: "Student Intern",
    company: "Geeta Technical Hub",
    period: "Jan 2024 – Mar 2024",
    bullets: [
      "Supported technical and software-development activities in a practical environment.",
      "Applied programming and problem-solving concepts to hands-on development tasks.",
      "Strengthened practical knowledge of web technologies and development workflows.",
      "Used Git/GitHub and modern development tools during project work.",
    ],
  },
];

export const languages = ["English — Professional", "Hindi — Native"];
