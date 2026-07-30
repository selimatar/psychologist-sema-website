const app = require('./app');
const config = require('./config');
const { startExpiryJob } = require('./jobs/expirePendingBookings');

app.listen(config.port, () => {
  console.log(`Booking API listening on port ${config.port}`);
  startExpiryJob();
});
