const availabilityService = require('../services/availability.service');

async function getAvailability(req, res, next) {
  try {
    const { from, to } = req.query;
    const result = await availabilityService.getAvailability(from, to);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAvailability };
