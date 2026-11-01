import { data } from "./generated/site";
export const copy = data.copy;
export const projects = copy.projects;
export const pagePaths = [
  "/",
  ...projects.map((p) => `/work/${p.slug}`),
  "/privacy",
  "/terms",
];
export const projectForSlug = (slug) => projects.find((p) => p.slug === slug);
export const projectStatusLabel = (p) =>
  p.type === "own"
    ? copy.common.ownProduct
    : p.status === "live"
      ? copy.common.live
      : copy.common.inBuild;
export const money = (n) => "$" + Number(n).toLocaleString("en-US");
export const interpolate = (text, values) =>
  text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
