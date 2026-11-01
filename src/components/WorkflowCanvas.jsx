import { useState } from "react";
import { Check, ArrowRight, Layers, Clock3, GitBranch } from "lucide-react";
import { copy } from "../content";
export default function WorkflowCanvas({ compact = false }) {
  const [active, setActive] = useState(0);
  const m = copy.mock;
  return (
    <div className={`workflow-canvas ${compact ? "is-compact" : ""}`}>
      <div className="canvas-chrome">
        <span className="canvas-mark">
          <Layers size={14} />
          {m.title}
        </span>
        <span className="canvas-demo">{copy.common.demo}</span>
      </div>
      <div className="canvas-content">
        <div className="canvas-heading">
          <h2>{copy.hero.visualTitle}</h2>
          <span className="canvas-symbol" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="canvas-tabs" role="tablist" aria-label={m.title}>
          {m.tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`workflow-panel-${i}`}
              id={`workflow-tab-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (
                  ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const index =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : (active + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  setActive(index);
                  document.getElementById(`workflow-tab-${index}`)?.focus();
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {m.tabs.map((tab, i) => (
          <div
            key={tab}
            id={`workflow-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`workflow-tab-${i}`}
            hidden={i !== active}
          >
            {i === 2 ? (
              <div className="canvas-pipeline">
                {m.stages.map((stage, j) => (
                  <div key={stage}>
                    <GitBranch size={16} />
                    <span>{stage}</span>
                    <i />
                    <i />
                    {j < 2 && (
                      <ArrowRight size={13} className="pipeline-arrow" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="canvas-table-head">
                  <span>{m.item}</span>
                  <span>{m.owner}</span>
                  <span>{m.state}</span>
                </div>
                <div className="canvas-table">
                  {m.rows.map(([item, role, state], j) => (
                    <div key={item} className="canvas-row">
                      <span>
                        <i className={`canvas-row-mark mark-${j}`}>
                          <Check size={10} />
                        </i>
                        {item}
                      </span>
                      <span>{role}</span>
                      <span className="canvas-status">
                        {i === 1 ? m.approved : state}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
        <div className="canvas-flow">
          {m.flow.map((step, i) => (
            <div key={step}>
              <span className="canvas-flow-node">
                <Check size={11} />
              </span>
              <small>{step}</small>
              {i < 2 && <i />}
            </div>
          ))}
        </div>
      </div>
      <div className="canvas-floating">
        <Clock3 size={18} />
        <span>
          {m.approvals}
          <small>{m.approved}</small>
        </span>
        <Check size={13} />
      </div>
      <div className="canvas-footer">
        <span className="live-dot" />
        {copy.hero.visualCaption}
      </div>
    </div>
  );
}
