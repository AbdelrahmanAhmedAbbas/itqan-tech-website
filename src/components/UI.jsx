import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { copy, projectStatusLabel } from "../content";
import { siteConfig } from "../site.config";
import { useBooking } from "../context/booking";
import { track } from "../lib/analytics";
export function LoomButton({ location = "final", className = "" }) {
  const { openLoom } = useBooking();
  return (
    <button
      type="button"
      className={`button button-primary ${className}`}
      onClick={() => {
        track("cta_click", { cta: "loom_request", location });
        openLoom(location);
      }}
    >
      {copy.common.primary}
      <ArrowUpRight size={17} aria-hidden="true" />
    </button>
  );
}
export function BookLink({ location = "final", className = "" }) {
  const { openBooking } = useBooking();
  return (
    <a
      className={`text-link booking-link ${className}`}
      href={siteConfig.booking.url || "/#loom-request"}
      onClick={(e) => {
        e.preventDefault();
        track("cta_click", { cta: "book_call", location });
        openBooking(location);
      }}
    >
      {copy.common.secondary}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}
export function CTAGroup({ location = "final" }) {
  return (
    <div className="funnel-actions">
      <LoomButton location={location} />
      <BookLink location={location} />
    </div>
  );
}
export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function SectionHeading({ eyebrow, title, accent, description }) {
  return (
    <div className="section-heading">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <div className="heading-row">
        <h2>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
export function Placeholder({ children, className = "" }) {
  if (!siteConfig.preview || !children) return null;
  return <p className={`placeholder ${className}`}>{children}</p>;
}
export function StatusChip({ project }) {
  return (
    <span
      className={`status-chip ${project.status === "live" ? "is-live" : ""}`}
    >
      <span aria-hidden="true" />
      {projectStatusLabel(project)}
    </span>
  );
}
export function CheckList({ items }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={15} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label={copy.common.home}>
      <img
        className="brand-for-dark"
        src="/brand/itqan-light.svg"
        width="108"
        height="55"
        alt={copy.common.brandAlt}
      />
      <img
        className="brand-for-light"
        src="/brand/itqan-dark.svg"
        width="108"
        height="55"
        alt={copy.common.brandAlt}
      />
    </Link>
  );
}
