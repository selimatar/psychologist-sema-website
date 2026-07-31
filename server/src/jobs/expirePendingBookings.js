const cron = require('node-cron');
const config = require('../config');
const bookingService = require('../services/booking.service');

function startExpiryJob() {
  return cron.schedule(config.expirySweepCron, async () => {
    try {
      const count = await bookingService.expireOverduePendingBookings();
      if (count > 0) console.log(`[expiry-sweep] expired ${count} stale pending booking(s)`);
    } catch (err) {
      console.error('[expiry-sweep] failed', err);
    }
  });
}

module.exports = { startExpiryJob };
