const prisma = require('../lib/prisma');
const sanityClient = require('../lib/sanityClient');
const config = require('../config');
const {
  localMidnightUtc,
  addDays,
  dayOfWeekLocal,
  slotStartFromMinutes,
  overlaps,
  localDateString,
} = require('../lib/dateUtils');

const DAY_NAME_TO_NUMBER = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function timeStringToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// Converts a Sanity `availabilityRule` document into the plain shape
// computeAvailableSlots expects. Kept as a small, pure, exported function so
// the Sanity-specific shape mapping can be unit-tested without a real
// Sanity project or mocking the network client.
function mapSanityRule(doc) {
  return {
    dayOfWeek: DAY_NAME_TO_NUMBER[doc.dayOfWeek],
    startMinutes: timeStringToMinutes(doc.startTime),
    endMinutes: timeStringToMinutes(doc.endTime),
    slotDurationMinutes: doc.slotDurationMinutes,
    isActive: doc.isActive,
  };
}

function mapSanityBlockedPeriod(doc) {
  return {
    startAt: new Date(doc.startAt),
    endAt: new Date(doc.endAt),
  };
}

/**
 * Pure function: given rules/blocked periods/active bookings already loaded,
 * compute the list of open slots per day in [from, to). Kept dependency-free
 * (no Prisma/Sanity calls) so it can be unit-tested directly.
 */
function computeAvailableSlots({
  rules,
  blockedPeriods,
  activeBookings,
  from,
  to,
  now = new Date(),
  minLeadMinutes = config.minBookingLeadMinutes,
}) {
  const earliestStart = new Date(now.getTime() + minLeadMinutes * 60000);
  const days = [];

  let cursor = localMidnightUtc(from);
  const end = localMidnightUtc(to);

  while (cursor < end) {
    const dow = dayOfWeekLocal(cursor);
    const dayRules = rules.filter((r) => r.isActive && r.dayOfWeek === dow);
    const slots = [];

    for (const rule of dayRules) {
      for (
        let minute = rule.startMinutes;
        minute + rule.slotDurationMinutes <= rule.endMinutes;
        minute += rule.slotDurationMinutes
      ) {
        const slotStart = slotStartFromMinutes(cursor, minute);
        const slotEnd = new Date(slotStart.getTime() + rule.slotDurationMinutes * 60000);

        if (slotStart < earliestStart) continue;

        const blocked = blockedPeriods.some((b) =>
          overlaps(slotStart, slotEnd, b.startAt, b.endAt)
        );
        if (blocked) continue;

        const taken = activeBookings.some((b) =>
          overlaps(slotStart, slotEnd, b.slotStart, b.slotEnd)
        );
        if (taken) continue;

        slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      }
    }

    slots.sort((a, b) => a.start.localeCompare(b.start));
    days.push({ date: localDateString(cursor), slots });
    cursor = addDays(cursor, 1);
  }

  return days;
}

// Rules/blocked periods now live in Sanity (edited via Studio); Booking data
// stays in Postgres. useCdn:false on sanityClient means this is always a
// live read, so psychologist edits reflect immediately.
async function fetchRulesAndBlockedPeriods(from, to) {
  const [sanityRules, sanityBlocked] = await Promise.all([
    sanityClient.fetch(`*[_type == "availabilityRule" && isActive == true]`),
    sanityClient.fetch(
      `*[_type == "blockedPeriod" && startAt < $to && endAt > $from]`,
      { from: from.toISOString(), to: to.toISOString() }
    ),
  ]);

  return {
    rules: sanityRules.map(mapSanityRule),
    blockedPeriods: sanityBlocked.map(mapSanityBlockedPeriod),
  };
}

async function getAvailability(from, to) {
  const [{ rules, blockedPeriods }, activeBookings] = await Promise.all([
    fetchRulesAndBlockedPeriods(from, to),
    prisma.booking.findMany({
      where: {
        slotStart: { lt: to },
        slotEnd: { gt: from },
        OR: [
          { status: 'APPROVED' },
          { status: 'PENDING', expiresAt: { gt: new Date() } },
        ],
      },
    }),
  ]);

  const days = computeAvailableSlots({ rules, blockedPeriods, activeBookings, from, to });

  return {
    timezone: config.timezone,
    days,
  };
}

module.exports = {
  getAvailability,
  computeAvailableSlots,
  mapSanityRule,
  mapSanityBlockedPeriod,
};
