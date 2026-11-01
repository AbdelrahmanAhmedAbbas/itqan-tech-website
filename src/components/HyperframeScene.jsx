import { useEffect, useRef, useState } from "react";
import { useMotion } from "../context/motion";
import { copy } from "../content";
import { useTheme } from "../lib/theme";
import { captures, captureAsset } from "../lib/captures";
export default function HyperframeScene(props) {
  const theme = useTheme();
  return <ScenePlayer key={props.slug + theme} {...props} theme={theme} />;
}
function ScenePlayer({ theme, slug, autoplay = false, progress = 0 }) {
  const { enabled } = useMotion();
  const host = useRef(null),
    player = useRef(null),
    playhead = useRef(progress);
  const [loaded, setLoaded] = useState(false);
  const [painted, setPainted] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || failed) return;
    let disposed = false;
    let idle, frame;
    const load = () => {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const register = () => {
            if (disposed) return;
            import("@hyperframes/player")
              .then(() => {
                if (!disposed) setLoaded(true);
              })
              .catch(() => {
                if (!disposed) setFailed(true);
              });
          };
          idle = window.requestIdleCallback
            ? window.requestIdleCallback(register, { timeout: 2000 })
            : window.setTimeout(register, 0);
        });
      });
    };
    const start = () => {
      if (document.readyState === "complete") load();
      else window.addEventListener("load", load, { once: true });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        start();
        observer.disconnect();
      },
      { rootMargin: "300px" },
    );
    observer.observe(host.current);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("load", load);
      cancelAnimationFrame(frame);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [enabled, failed]);
  useEffect(() => {
    const element = player.current;
    if (!loaded || !element) return;
    let visible = false;
    const sync = () => {
      if (!element.ready) return;
      const iframe = element.iframeElement;
      if (iframe) {
        iframe.title = `${captures[slug].label}: ${copy.common.demo}`;
        iframe.tabIndex = -1;
        const colors =
          theme === "light"
            ? {
                bg: "#edf0f6",
                fg: "#202b40",
                accent: "#805b2e",
                muted: "#526079",
              }
            : {
                bg: "#0c111b",
                fg: "#f3f1eb",
                accent: "#d9b98f",
                muted: "#b5bdcc",
              };
        for (const [key, value] of Object.entries(colors))
          iframe.contentDocument.documentElement.style.setProperty(
            `--film-${key}`,
            value,
          );
      }
      if (autoplay && enabled && visible && !document.hidden) element.play();
      else {
        element.pause();
        if (!autoplay) element.seek(playhead.current * 11.98);
      }
    };
    const paint = () => {
        // A root timeline alone is not a painted scene if its sub-composition failed.
        const capture = element.iframeElement?.contentDocument?.querySelector(
          '#capture-main img, [data-hf-authored-id="capture-main"] img',
        );
        if (!capture?.complete || !capture.naturalWidth) setFailed(true);
        else setPainted(true);
      },
      error = () => setFailed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.08 },
    );
    observer.observe(element);
    element.addEventListener("ready", sync);
    element.addEventListener("painted", paint);
    element.addEventListener("error", error);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      element.pause();
      observer.disconnect();
      element.removeEventListener("ready", sync);
      element.removeEventListener("painted", paint);
      element.removeEventListener("error", error);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [loaded, enabled, autoplay, slug, theme]);
  useEffect(() => {
    playhead.current = progress;
    if (enabled && !autoplay && player.current?.ready)
      player.current.seek(progress * 11.98);
  }, [progress, enabled, autoplay]);
  return (
    <div
      className={`hyperframe-scene ${painted && enabled && !failed ? "is-painted" : ""}`}
      ref={host}
      role="img"
      aria-label={captures[slug].label + ". " + captures[slug].short}
    >
      <img
        className="scene-poster"
        src={captureAsset(slug, theme === "light" ? "poster-light" : "poster")}
        alt=""
        width="1440"
        height="900"
        loading={autoplay ? "eager" : "lazy"}
        fetchPriority={autoplay ? "high" : "auto"}
        srcSet={`${captureAsset(slug, theme === "light" ? "poster-small-light" : "poster-small")} 720w, ${captureAsset(slug, theme === "light" ? "poster-light" : "poster")} 1440w`}
        sizes={autoplay ? "(max-width: 900px) 100vw, 50vw" : "90vw"}
      />
      {loaded && !failed && (
        <hyperframes-player
          ref={player}
          src={`/motion/${slug}/index.html`}
          runtime-src="/motion/runtime.js"
          width="1440"
          height="900"
          muted=""
          audio-locked=""
          low-power-idle=""
          disable-click-to-play=""
          assets-loading-ui="none"
          loop={autoplay ? "" : undefined}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
