const bookingService = require('../../services/booking.service');

async function list(req, res, next) {
  try {
    res.json(await bookingService.listBookings({}));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { slotStart, slotEnd, clientName, clientEmail, notes } = req.body;
    const { booking } = await bookingService.createBooking({
      slotStart,
      slotEnd,
      source: 'MANUAL',
      clientName,
      clientEmail,
      notes,
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err instanceof bookingService.SlotUnavailableError) {
      return res.status(409).json({ error: 'SLOT_UNAVAILABLE' });
    }
    next(err);
  }
}

async function reschedule(req, res, next) {
  try {
    const booking = await bookingService.rescheduleBooking(req.params.id, req.body);
    res.json(booking);
  } catch (err) {
    if (err instanceof bookingService.SlotUnavailableError) {
      return res.status(409).json({ error: 'SLOT_UNAVAILABLE' });
    }
    if (err instanceof bookingService.InvalidTransitionError) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (err) {
    if (err instanceof bookingService.InvalidTransitionError) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { list, create, reschedule, cancel };
