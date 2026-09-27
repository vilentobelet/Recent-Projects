import type { Project } from "../model";

export const fieldnode: Project = {
  id: 1,
  name: "Fieldnode",
  industry: "B2B",
  idea: "Fieldnode is a B2B platform for the energy and heavy industries that enables companies to manage digital spare parts, streamline qualification and RFQ workflows, and manufacture parts on demand through a global network of verified suppliers.",
  link: "https://fieldnode.com",
  password: "",
  color: "orange",
  logoUrl: "https://www.google.com/s2/favicons?domain=fieldnode.com&sz=128",
  featured: true,
};

export const fieldnodeDesignSystem: Project = {
  id: 2,
  name: "Fieldnode - Design System",
  industry: "Design System",
  idea: "Built a Design System on top of the shadcn library, using its foundation while creating a more structured and scalable component architecture.",
  link: "https://www.figma.com/design/MkXho11dOzAd3OI9l75731/Design-System",
  password: "demo-access",
  color: "orange",
  logoUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
  featured: true,
};

export const scholarsapp: Project = {
  id: 3,
  name: "Scholarsapp",
  industry: "Saas, EdTech",
  idea: "ScholarsApp is an EdTech platform that connects students with relevant scholarship opportunities while simplifying the entire application and scholarship management process for students, counselors, and donors.",
  link: "https://scholarsapp.com",
  password: "",
  color: "blue",
  logoUrl: "https://www.google.com/s2/favicons?domain=scholarsapp.com&sz=128",
  featured: false,
};

export const roadman: Project = {
  id: 4,
  name: "RoadManTech - RMT",
  industry: "AI, B2B, Dashboard, Web app",
  idea: "RoadManTech is a B2B SaaS platform for roadway and infrastructure management that helps government agencies monitor pavement conditions, manage maintenance work, and optimize infrastructure budgets using real-time data and analytics.",
  link: "https://www.figma.com/design/V98pwMG4mhkJZGbQ3gNLH8/Before---RMT",
  password: "",
  color: "emerald",
  logoUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
  featured: false,
};

export const sampleProjects = [fieldnode, fieldnodeDesignSystem, scholarsapp, roadman];
