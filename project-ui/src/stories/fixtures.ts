import catalog from "../../../data/projects.json";
import { tagsFromIndustry, type Project } from "../model";

export const sampleProjects = catalog.projects as Project[];

export function projectByName(name: string) {
  const project = sampleProjects.find((item) => item.name === name);
  if (!project) throw new Error(`Missing project in data/projects.json: ${name}`);
  return project;
}

export function catalogCategories() {
  const tags = sampleProjects.flatMap((project) => tagsFromIndustry(project.industry));
  return ["All", ...[...new Set(tags)]];
}

export function catalogLink(kind: "site" | "figma") {
  const project = sampleProjects.find((item) => {
    const host = item.link.toLowerCase();
    return kind === "figma" ? host.includes("figma.com") : !host.includes("figma.com");
  });
  if (!project) throw new Error(`Missing ${kind} link in data/projects.json`);
  return project.link;
}
