const bookingService = require('../../services/booking.service');

async function list(req, res, next) {
  try {
    const { status } = req.query;
    const bookings = await bookingService.listBookings({ status });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const booking = await bookingService.approveBooking(req.params.id);
    res.json(booking);
  } catch (err) {
    if (err instanceof bookingService.InvalidTransitionError) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const booking = await bookingService.rejectBooking(req.params.id, req.body.reason);
    res.json(booking);
  } catch (err) {
    if (err instanceof bookingService.InvalidTransitionError) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = { list, approve, reject };
