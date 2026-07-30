const bookingService = require('../services/booking.service');

async function createBookingRequest(req, res, next) {
  try {
    const { name, email, topic, notes, slotStart, slotEnd } = req.body;
    const { booking, googleFormUrl } = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'CLIENT_REQUEST',
      clientName: name,
      clientEmail: email,
      topic,
      notes,
    });

    res.status(201).json({
      id: booking.id,
      status: booking.status,
      slotStart: booking.slotStart,
      slotEnd: booking.slotEnd,
      expiresAt: booking.expiresAt,
      googleFormUrl,
    });
  } catch (err) {
    if (err instanceof bookingService.SlotUnavailableError) {
      return res.status(409).json({ error: 'SLOT_UNAVAILABLE' });
    }
    next(err);
  }
}

module.exports = { createBookingRequest };
