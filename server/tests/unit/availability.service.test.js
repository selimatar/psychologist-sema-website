const {
  computeAvailableSlots,
  mapSanityRule,
  mapSanityBlockedPeriod,
} = require('../../src/services/availability.service');

const MON = '2026-08-03'; // a Monday, per config's fixed UTC+3 offset

function iso(dateStr, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(`${dateStr}T00:00:00+03:00`.replace('T00:00:00', `T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`));
}

const mondayRule = {
  dayOfWeek: 1,
  startMinutes: 9 * 60,
  endMinutes: 12 * 60,
  slotDurationMinutes: 60,
  isActive: true,
};

describe('computeAvailableSlots', () => {
  const from = new Date(`${MON}T00:00:00+03:00`);
  const to = new Date(`${MON}T00:00:00+03:00`);
  to.setUTCDate(to.getUTCDate() + 1);
  const farPastLead = new Date(`${MON}T00:00:00+03:00`); // now = start of day, lead time won't exclude anything

  test('generates slots from the matching weekly rule', () => {
    const days = computeAvailableSlots({
      rules: [mondayRule],
      blockedPeriods: [],
      activeBookings: [],
      from,
      to,
      now: farPastLead,
      minLeadMinutes: 0,
    });

    expect(days).toHaveLength(1);
    expect(days[0].date).toBe(MON);
    expect(days[0].slots).toEqual([
      { start: iso(MON, '09:00').toISOString(), end: iso(MON, '10:00').toISOString() },
      { start: iso(MON, '10:00').toISOString(), end: iso(MON, '11:00').toISOString() },
      { start: iso(MON, '11:00').toISOString(), end: iso(MON, '12:00').toISOString() },
    ]);
  });

  test('excludes slots overlapping a blocked period', () => {
    const days = computeAvailableSlots({
      rules: [mondayRule],
      blockedPeriods: [{ startAt: iso(MON, '10:00'), endAt: iso(MON, '11:00') }],
      activeBookings: [],
      from,
      to,
      now: farPastLead,
      minLeadMinutes: 0,
    });

    expect(days[0].slots).toEqual([
      { start: iso(MON, '09:00').toISOString(), end: iso(MON, '10:00').toISOString() },
      { start: iso(MON, '11:00').toISOString(), end: iso(MON, '12:00').toISOString() },
    ]);
  });

  test('excludes slots already held by an active (approved or non-expired pending) booking', () => {
    const days = computeAvailableSlots({
      rules: [mondayRule],
      blockedPeriods: [],
      activeBookings: [{ slotStart: iso(MON, '09:00'), slotEnd: iso(MON, '10:00') }],
      from,
      to,
      now: farPastLead,
      minLeadMinutes: 0,
    });

    expect(days[0].slots.map((s) => s.start)).not.toContain(iso(MON, '09:00').toISOString());
    expect(days[0].slots).toHaveLength(2);
  });

  test('excludes slots inside the minimum lead time', () => {
    const days = computeAvailableSlots({
      rules: [mondayRule],
      blockedPeriods: [],
      activeBookings: [],
      from,
      to,
      now: iso(MON, '09:30'),
      minLeadMinutes: 120,
    });

    // now=09:30 + 120min lead = 11:30, so only the 11:00-12:00 slot survives
    // (it starts before 11:30 but the check is slotStart < earliestStart,
    // so 11:00 start is excluded too — only slots starting at/after 11:30 remain, i.e. none in this rule)
    expect(days[0].slots).toEqual([]);
  });

  test('day with no matching weekly rule has no slots', () => {
    const tuesday = new Date(from);
    tuesday.setUTCDate(tuesday.getUTCDate() + 1);
    const dayAfter = new Date(tuesday);
    dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);

    const days = computeAvailableSlots({
      rules: [mondayRule],
      blockedPeriods: [],
      activeBookings: [],
      from: tuesday,
      to: dayAfter,
      now: farPastLead,
      minLeadMinutes: 0,
    });

    expect(days[0].slots).toEqual([]);
  });
});

describe('mapSanityRule', () => {
  test('maps a Sanity availabilityRule document to the plain rule shape', () => {
    expect(
      mapSanityRule({
        dayOfWeek: 'monday',
        startTime: '09:00',
        endTime: '12:00',
        slotDurationMinutes: 60,
        isActive: true,
      })
    ).toEqual({
      dayOfWeek: 1,
      startMinutes: 540,
      endMinutes: 720,
      slotDurationMinutes: 60,
      isActive: true,
    });
  });

  test('maps sunday to 0', () => {
    expect(
      mapSanityRule({
        dayOfWeek: 'sunday',
        startTime: '00:00',
        endTime: '00:30',
        slotDurationMinutes: 30,
        isActive: false,
      })
    ).toEqual({
      dayOfWeek: 0,
      startMinutes: 0,
      endMinutes: 30,
      slotDurationMinutes: 30,
      isActive: false,
    });
  });
});

describe('mapSanityBlockedPeriod', () => {
  test('maps a Sanity blockedPeriod document to Date-based start/end', () => {
    const result = mapSanityBlockedPeriod({
      startAt: '2026-08-03T06:00:00.000Z',
      endAt: '2026-08-03T10:00:00.000Z',
    });

    expect(result.startAt).toBeInstanceOf(Date);
    expect(result.endAt).toBeInstanceOf(Date);
    expect(result.startAt.toISOString()).toBe('2026-08-03T06:00:00.000Z');
    expect(result.endAt.toISOString()).toBe('2026-08-03T10:00:00.000Z');
  });
});
