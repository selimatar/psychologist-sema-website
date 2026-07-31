const sgMail = require('@sendgrid/mail');
const config = require('../config');

if (config.sendgridApiKey) {
  sgMail.setApiKey(config.sendgridApiKey);
}

function formatSlot(booking) {
  return new Date(booking.slotStart).toLocaleString('tr-TR', {
    timeZone: config.timezone,
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

// Sends are fire-and-forget relative to the API response: a booking is
// already committed to the DB before any of these are called, so an email
// failure must never surface as a failed booking request.
async function send(msg) {
  if (!config.sendgridApiKey) {
    console.log('[email:skipped, no SENDGRID_API_KEY]', msg.to, msg.subject);
    return;
  }
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error('[email:failed]', msg.to, msg.subject, err.message);
  }
}

async function sendNewRequestToPsychologist(booking) {
  if (!config.psychologistEmail) return;
  await send({
    to: config.psychologistEmail,
    from: config.emailFrom,
    subject: 'Yeni randevu talebi',
    text: `${booking.clientName} (${booking.clientEmail}) requested ${formatSlot(
      booking
    )}.\nTopic: ${booking.topic || '-'}\nNotes: ${booking.notes || '-'}\n\nReview it in the admin panel.`,
  });
}

async function sendApprovedToClient(booking, googleFormUrl) {
  if (!booking.clientEmail) return;
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevunuz onaylandı',
    text: `Your appointment on ${formatSlot(booking)} has been confirmed.${
      googleFormUrl ? `\n\nIf you haven't already, please complete the intake form: ${googleFormUrl}` : ''
    }`,
  });
}

async function sendRejectedToClient(booking) {
  if (!booking.clientEmail) return;
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevu talebiniz hakkında',
    text: `Unfortunately your requested slot on ${formatSlot(booking)} is not available.${
      booking.rejectionReason ? `\n\nNote: ${booking.rejectionReason}` : ''
    }\n\nPlease submit a new request for another time.`,
  });
}

async function sendExpiredToClient(booking) {
  if (!booking.clientEmail) return;
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevu talebinizin süresi doldu',
    text: `Your requested slot on ${formatSlot(
      booking
    )} was not confirmed in time and has been released. Please submit a new request if you'd still like to book.`,
  });
}

module.exports = {
  sendNewRequestToPsychologist,
  sendApprovedToClient,
  sendRejectedToClient,
  sendExpiredToClient,
};
