import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BookingContext } from "../context/booking";
import { copy } from "../content";
import { siteConfig } from "../site.config";
import { track } from "../lib/analytics";
import AuditForm from "./AuditForm";
import BookingWidget from "./BookingWidget";
import { Placeholder } from "./UI";
export default function BookingProvider({ children }) {
  const [panel, setPanel] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const close = () => setPanel(null);
  const openBooking = (location) => {
    if (
      siteConfig.booking.url &&
      window.matchMedia("(max-width:700px)").matches
    ) {
      const tab = window.open(
        siteConfig.booking.url,
        "_blank",
        "noopener,noreferrer",
      );
      if (tab) tab.opener = null;
      track("booking_open", { location });
      return;
    }
    opener.current = document.activeElement;
    setPanel("booking");
    if (siteConfig.booking.url) track("booking_open", { location });
  };
  const openLoom = (location) => {
    track("loom_form_open", { location });
    if (location === "final" && document.getElementById("loom-request")) {
      document
        .getElementById("loom-request")
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      document.getElementById("audit-name")?.focus({ preventScroll: true });
      return;
    }
    opener.current = document.activeElement;
    setPanel("loom");
  };
  useEffect(() => {
    if (!panel) return;
    const el = dialog.current;
    el.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      el.close();
      opener.current?.focus({ preventScroll: true });
    };
  }, [panel]);
  return (
    <BookingContext.Provider value={{ openBooking, openLoom }}>
      {children}
      <dialog
        ref={dialog}
        className={`booking-dialog ${panel === "loom" ? "loom-dialog" : ""}`}
        aria-labelledby="request-dialog-title"
        onClose={close}
        onCancel={close}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        {panel && (
          <div className="booking-dialog-inner">
            <div className="booking-dialog-header">
              <div>
                <p className="eyebrow">{copy.hero.eyebrow}</p>
                <h2 id="request-dialog-title">
                  {panel === "loom"
                    ? copy.form.title
                    : copy.common.bookingTitle}
                </h2>
                {panel === "booking" && <p>{copy.common.bookingNote}</p>}
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={close}
                aria-label={copy.common.close}
                autoFocus
              >
                <X size={21} />
              </button>
            </div>
            {panel === "loom" ? (
              <AuditForm prefix="modal" />
            ) : (
              <>
                <BookingWidget />
                <Placeholder>{siteConfig.pending.bookingUrl}</Placeholder>
              </>
            )}
          </div>
        )}
      </dialog>
    </BookingContext.Provider>
  );
}
