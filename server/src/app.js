const express = require('express');
const cors = require('cors');
const config = require('./config');

const availabilityRoutes = require('./routes/availability.routes');
const bookingRequestsRoutes = require('./routes/bookingRequests.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.corsOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/availability', availabilityRoutes);
app.use('/api/booking-requests', bookingRequestsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL_ERROR' });
});

module.exports = app;
