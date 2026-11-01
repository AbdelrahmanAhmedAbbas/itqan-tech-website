import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { copy } from "../content";
import { MotionContext } from "../context/motion";
const query = "(prefers-reduced-motion: reduce)";
const subscribe = (notify) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
export default function MotionProvider({ children }) {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  const [paused, setPaused] = useState(false);
  const enabled = !reduced && !paused;
  const value = useMemo(() => ({ enabled }), [enabled]);
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "paused";
    return () => delete document.documentElement.dataset.motion;
  }, [enabled]);
  return (
    <MotionContext.Provider value={value}>
      {children}
      <button
        className="motion-toggle"
        type="button"
        onClick={() => setPaused(!paused)}
        disabled={reduced}
        aria-label={
          reduced
            ? copy.common.reducedLabel
            : paused
              ? copy.common.play
              : copy.common.pause
        }
        aria-pressed={!enabled}
      >
        {enabled ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Play size={14} aria-hidden="true" />
        )}
        <span>
          {reduced
            ? copy.common.reduced
            : paused
              ? copy.common.play
              : copy.common.pause}
        </span>
      </button>
    </MotionContext.Provider>
  );
}
