import { copy, projects } from "../content";
export const captures = Object.fromEntries(
  projects.map((project) => [
    project.slug,
    {
      label: project.name,
      note: copy.mock.visualNote,
      short: copy.common.demo,
      phases: copy.mock.phaseNames,
      descriptions: copy.mock.phaseDescriptions,
      accent: project.slug === "core-en" ? "#8baeff" : "#d9b98f",
    },
  ]),
);
export const captureAsset = (slug, name = "main") =>
  `/motion/${slug}/assets/${name}.webp`;
