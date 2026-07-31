// Turkey has used a fixed UTC+3 offset with no DST since 2016, so a plain
// fixed-offset conversion is correct here without pulling in a full IANA
// timezone library. If the clinic ever operates in a DST-observing zone,
// swap this for date-fns-tz/luxon instead of adjusting OFFSET_MINUTES.
const OFFSET_MINUTES = 180;
const DAY_MS = 24 * 60 * 60 * 1000;

function localMidnightUtc(utcDate) {
  const shifted = new Date(utcDate.getTime() + OFFSET_MINUTES * 60000);
  const localMidnightShifted = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate()
  );
  return new Date(localMidnightShifted - OFFSET_MINUTES * 60000);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function dayOfWeekLocal(utcDate) {
  const shifted = new Date(utcDate.getTime() + OFFSET_MINUTES * 60000);
  return shifted.getUTCDay();
}

function slotStartFromMinutes(localDayMidnightUtc, minutesFromMidnight) {
  return new Date(localDayMidnightUtc.getTime() + minutesFromMidnight * 60000);
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// YYYY-MM-DD calendar date in clinic-local time for a UTC instant that is
// itself a local midnight (as produced by localMidnightUtc) — NOT
// `utcDate.toISOString().slice(0, 10)`, which reads the UTC calendar date
// and is off by one whenever local midnight falls on the previous UTC day.
function localDateString(localMidnightUtcDate) {
  const shifted = new Date(localMidnightUtcDate.getTime() + OFFSET_MINUTES * 60000);
  return shifted.toISOString().slice(0, 10);
}

module.exports = {
  OFFSET_MINUTES,
  DAY_MS,
  localMidnightUtc,
  addDays,
  dayOfWeekLocal,
  slotStartFromMinutes,
  overlaps,
  localDateString,
};
