import HyperframeScene from "./HyperframeScene";
import { captures } from "../lib/captures";

export default function ProjectVisual({
  project,
  large = false,
  decorative = false,
}) {
  const data = captures[project.slug];
  return (
    <div
      className={`project-visual capture-visual capture-${project.type === "own" ? "own" : project.slug} ${large ? "visual-large" : ""}`}
      role="img"
      aria-hidden={decorative || undefined}
      aria-label={`${project.name}: ${data.short}`}
    >
      <div className="capture-grid" aria-hidden="true" />
      <HyperframeScene slug={project.slug} autoplay />
      <span className="capture-badge">
        <i />
        {data.short}
      </span>
    </div>
  );
}
