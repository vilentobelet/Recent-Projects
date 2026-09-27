import type { CSSProperties } from "react";

export const COLOR_THEMES = {
  orange: { name: "Orange", accent: "#f97316", soft: "rgba(249,115,22,.12)", border: "rgba(249,115,22,.28)" },
  blue: { name: "Blue", accent: "#3b82f6", soft: "rgba(59,130,246,.12)", border: "rgba(59,130,246,.28)" },
  emerald: { name: "Emerald", accent: "#10b981", soft: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.28)" },
  violet: { name: "Violet", accent: "#8b5cf6", soft: "rgba(139,92,246,.12)", border: "rgba(139,92,246,.28)" },
  rose: { name: "Rose", accent: "#f43f5e", soft: "rgba(244,63,94,.12)", border: "rgba(244,63,94,.28)" },
  cyan: { name: "Cyan", accent: "#06b6d4", soft: "rgba(6,182,212,.12)", border: "rgba(6,182,212,.28)" },
} as const;

export type ProductColor = keyof typeof COLOR_THEMES;
export type ViewMode = "cards" | "compact";
export type LinkKind = "Site" | "Figma" | "Prototype";

export type Project = {
  id: number;
  industry: string;
  name: string;
  idea: string;
  link: string;
  password: string;
  color: ProductColor;
  logoUrl: string;
  featured: boolean;
};

export function tagsFromIndustry(value: string) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

export function normaliseLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getDisplayLink(value: string) {
  try {
    const url = new URL(normaliseLink(value));
    return `${url.host.replace(/^www\./, "")}${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}

export function getLinkKind(value: string): LinkKind {
  try {
    const url = new URL(normaliseLink(value));
    const host = url.host.replace(/^www\./, "").toLowerCase();
    if (host === "figma.com" || host.endsWith(".figma.com")) return url.pathname.toLowerCase().startsWith("/proto/") ? "Prototype" : "Figma";
    if (host.endsWith(".figma.site") || host.endsWith(".framer.website") || host.endsWith(".webflow.io") || host.endsWith(".vercel.app") || host.endsWith(".netlify.app") || host.endsWith(".github.io")) return "Prototype";
  } catch {
    /* keep Site */
  }
  return "Site";
}

export function getFaviconUrl(value: string) {
  try {
    const host = new URL(normaliseLink(value)).host.replace(/^www\./, "");
    return host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64` : "";
  } catch {
    return "";
  }
}

export function cardThemeStyle(color: ProductColor): CSSProperties {
  const theme = COLOR_THEMES[color] ?? COLOR_THEMES.orange;
  return {
    "--card-accent": theme.accent,
    "--card-soft": theme.soft,
    "--card-border": theme.border,
  } as CSSProperties;
}
