import { lazy, Suspense } from "react";
import { copy } from "../content";
import { siteConfig } from "../site.config";
const BookingEmbed = lazy(() => import("./BookingEmbed"));
export default function BookingWidget() {
  if (!siteConfig.booking.url) return <p>{copy.common.bookingUnavailable}</p>;
  return (
    <>
      <Suspense fallback={<p role="status">{copy.common.loading}</p>}>
        <BookingEmbed />
      </Suspense>
      <a
        className="calendar-fallback"
        href={siteConfig.booking.url}
        target="_blank"
        rel="noreferrer"
      >
        {copy.common.bookingFallback} ↗
      </a>
    </>
  );
}
