require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 4000),
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  timezone: process.env.TIMEZONE || 'Europe/Istanbul',

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '14d',

  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'no-reply@example.com',
  psychologistEmail: process.env.PSYCHOLOGIST_EMAIL || '',

  googleFormBaseUrl: process.env.GOOGLE_FORM_BASE_URL || '',
  googleFormBookingIdEntry: process.env.GOOGLE_FORM_BOOKING_ID_ENTRY || '',

  sanityProjectId: required('SANITY_PROJECT_ID'),
  sanityDataset: process.env.SANITY_DATASET || 'production',
  sanityApiVersion: process.env.SANITY_API_VERSION || '2025-07-01',
  sanityReadToken: process.env.SANITY_READ_TOKEN || '',

  pendingBookingTtlHours: Number(process.env.PENDING_BOOKING_TTL_HOURS || 72),
  minBookingLeadMinutes: Number(process.env.MIN_BOOKING_LEAD_MINUTES || 120),
};
