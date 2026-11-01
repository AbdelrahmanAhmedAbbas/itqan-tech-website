export function getBookingUrl(booking) {
  return booking.provider === "calendly"
    ? booking.calendlyUrl
    : `https://cal.com/${booking.calLink}`;
}
