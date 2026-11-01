import { copy } from "../content";
import { siteConfig } from "../site.config";
export default function BookingEmbed() {
  return (
    <iframe
      className="booking-frame"
      title={copy.common.bookingTitle}
      src={siteConfig.booking.url}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="payment"
    />
  );
}
