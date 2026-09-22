import { siteConfig } from "../config/site";

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  color: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: siteConfig.github,
    icon: "GH",
    color: "#ffffff",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: siteConfig.linkedin,
    icon: "LI",
    color: "#0A66C2",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    url: siteConfig.portfolio,
    icon: "PF",
    color: "#2DE2E6",
  },
  {
    id: "email",
    label: "Email",
    url: siteConfig.email,
    icon: "EM",
    color: "#FFB84D",
  },
];
