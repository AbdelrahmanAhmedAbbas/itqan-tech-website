import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { copy, interpolate } from "../content";
import { captures, captureAsset } from "../lib/captures";
import { useMotion } from "../context/motion";
import HyperframeScene from "./HyperframeScene";
export default function ScrollShowcase({ project }) {
  const data = captures[project.slug],
    root = useRef(null);
  const { enabled } = useMotion();
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let frame;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const bounds = root.current.getBoundingClientRect();
        setProgress(
          Math.max(
            0,
            Math.min(
              1,
              (96 - bounds.top) /
                Math.max(1, bounds.height - window.innerHeight + 96),
            ),
          ),
        );
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);
  const phase = Math.min(2, Math.floor(progress * 3));
  return (
    <section
      className={`scroll-showcase ${enabled ? "motion-enabled" : "motion-static"}`}
      ref={root}
      aria-label={interpolate(copy.common.walkthrough, { name: project.name })}
      style={{ "--scene-accent": data.accent }}
    >
      <div className="showcase-sticky container">
        <div className="showcase-heading">
          <span className="eyebrow">{copy.common.inside}</span>
          <span className="showcase-hint">
            <ArrowDown size={13} aria-hidden="true" />
            {enabled ? copy.common.scrollExplore : copy.common.captures}
          </span>
        </div>
        <div className="showcase-playback">
          <button
            type="button"
            className="text-link motion-preview-button"
            disabled={!enabled}
            aria-pressed={playing}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? copy.common.motionScroll : copy.common.motionAutoplay}
            <span aria-hidden="true">{playing ? "↓" : "▶"}</span>
          </button>
        </div>
        <HyperframeScene
          slug={project.slug}
          progress={progress}
          autoplay={playing}
        />
        <ol className="showcase-chapters">
          {data.phases.map((label, index) => (
            <li key={label} className={phase === index ? "is-current" : ""}>
              <span className="chapter-index">0{index + 1}</span>
              <div>
                <h2>{label}</h2>
                <p>{data.descriptions[index]}</p>
              </div>
              <span className="chapter-line">
                <i
                  style={{
                    transform: `scaleX(${Math.max(0, Math.min(1, progress * 3 - index))})`,
                  }}
                />
              </span>
            </li>
          ))}
        </ol>
        <p className="showcase-current-description" aria-hidden="true">
          {data.descriptions[phase]}
        </p>
        <p className="capture-provenance">{data.note}</p>
        <a
          className="capture-fullsize"
          href={captureAsset(
            project.slug,
            project.type === "own" ? "detail-b" : "main",
          )}
          target="_blank"
          rel="noreferrer"
        >
          {copy.common.captures} <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        {!enabled && (
          <div className="static-capture-gallery">
            {["detail-a", "detail-b"].map((name, i) => (
              <figure key={name}>
                <img
                  src={captureAsset(project.slug, name)}
                  alt={data.phases[i + 1]}
                  loading="lazy"
                />
                <figcaption>{data.phases[i + 1]}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
