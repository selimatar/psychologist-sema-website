const prisma = require('../lib/prisma');
const config = require('../config');
const emailService = require('./email.service');
const googleFormService = require('./googleForm.service');

class SlotUnavailableError extends Error {
  constructor() {
    super('SLOT_UNAVAILABLE');
    this.code = 'SLOT_UNAVAILABLE';
  }
}

class InvalidTransitionError extends Error {
  constructor(message) {
    super(message);
    this.code = 'INVALID_TRANSITION';
  }
}

function isUniqueConstraintError(err) {
  return err && err.code === 'P2002';
}

function pendingExpiryDate(now = new Date()) {
  return new Date(now.getTime() + config.pendingBookingTtlHours * 3600000);
}

// Expires (in-place) any stale PENDING row occupying `slotStart`, inside the
// given transaction client. This closes the race between the create attempt
// and the periodic sweep job, so a stale hold can never block a fresh request.
async function expireStaleAtSlot(tx, slotStart) {
  await tx.booking.updateMany({
    where: {
      lockKey: slotStart,
      status: 'PENDING',
      expiresAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED', lockKey: null },
  });
}

async function createBooking({
  slotStart,
  slotEnd,
  source,
  clientName,
  clientEmail,
  topic,
  notes,
}) {
  try {
    const booking = await prisma.$transaction(async (tx) => {
      await expireStaleAtSlot(tx, slotStart);

      return tx.booking.create({
        data: {
          slotStart,
          slotEnd,
          lockKey: slotStart,
          status: source === 'MANUAL' ? 'APPROVED' : 'PENDING',
          source,
          clientName,
          clientEmail,
          topic,
          notes,
          expiresAt: source === 'MANUAL' ? null : pendingExpiryDate(),
        },
      });
    });

    if (source === 'CLIENT_REQUEST') {
      const googleFormUrl = googleFormService.buildPrefilledUrl(booking.id);
      await emailService.sendNewRequestToPsychologist(booking);
      return { booking, googleFormUrl };
    }

    return { booking, googleFormUrl: null };
  } catch (err) {
    if (isUniqueConstraintError(err)) throw new SlotUnavailableError();
    throw err;
  }
}

async function approveBooking(id) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new InvalidTransitionError('Booking not found');
  if (booking.status !== 'PENDING' || (booking.expiresAt && booking.expiresAt < new Date())) {
    throw new InvalidTransitionError('Booking is not pending');
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'APPROVED', respondedAt: new Date() },
  });

  await emailService.sendApprovedToClient(updated, googleFormService.buildPrefilledUrl(updated.id));
  return updated;
}

async function rejectBooking(id, reason) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new InvalidTransitionError('Booking not found');
  if (booking.status !== 'PENDING') {
    throw new InvalidTransitionError('Booking is not pending');
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: 'REJECTED',
      lockKey: null,
      rejectionReason: reason || null,
      respondedAt: new Date(),
    },
  });

  await emailService.sendRejectedToClient(updated);
  return updated;
}

async function cancelBooking(id) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new InvalidTransitionError('Booking not found');
  if (booking.status === 'CANCELLED') return booking;

  return prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED', lockKey: null },
  });
}

async function rescheduleBooking(id, { slotStart, slotEnd }) {
  try {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking) throw new InvalidTransitionError('Booking not found');
      if (!['PENDING', 'APPROVED'].includes(booking.status)) {
        throw new InvalidTransitionError('Booking cannot be rescheduled from its current status');
      }

      await expireStaleAtSlot(tx, slotStart);

      return tx.booking.update({
        where: { id },
        data: { slotStart, slotEnd, lockKey: slotStart },
      });
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) throw new SlotUnavailableError();
    throw err;
  }
}

// Sweep job: expire any PENDING booking past its TTL, regardless of slot,
// and notify the client. Correctness doesn't depend on this running (see
// expireStaleAtSlot above) — it exists for admin-list hygiene + the email.
async function expireOverduePendingBookings() {
  const stale = await prisma.booking.findMany({
    where: { status: 'PENDING', expiresAt: { lt: new Date() } },
  });

  for (const booking of stale) {
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'EXPIRED', lockKey: null },
    });
    await emailService.sendExpiredToClient(updated);
  }

  return stale.length;
}

function listBookings({ status } = {}) {
  return prisma.booking.findMany({
    where: status ? { status } : undefined,
    orderBy: { slotStart: 'asc' },
  });
}

module.exports = {
  SlotUnavailableError,
  InvalidTransitionError,
  createBooking,
  approveBooking,
  rejectBooking,
  cancelBooking,
  rescheduleBooking,
  expireOverduePendingBookings,
  listBookings,
};
