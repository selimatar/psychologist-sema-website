const config = require('../config');

// Requires a one-time manual setup: add a short-answer "Booking Reference"
// field to the Google Form, then use Google Forms' "Get pre-filled link"
// tool to find that field's entry.XXXXXXXX id and set it as
// GOOGLE_FORM_BOOKING_ID_ENTRY.
function buildPrefilledUrl(bookingId) {
  if (!config.googleFormBaseUrl || !config.googleFormBookingIdEntry) {
    return config.googleFormBaseUrl || null;
  }
  const url = new URL(config.googleFormBaseUrl);
  url.searchParams.set(config.googleFormBookingIdEntry, bookingId);
  return url.toString();
}

module.exports = { buildPrefilledUrl };
