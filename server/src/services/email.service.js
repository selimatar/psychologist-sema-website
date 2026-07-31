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
    text: `${booking.clientName} (${booking.clientEmail}) ${formatSlot(
      booking
    )} için randevu talep etti.\nKonu: ${booking.topic || '-'}\nNot: ${booking.notes || '-'}\n\nYönetim panelinden inceleyebilirsiniz.`,
  });
}

async function sendApprovedToClient(booking, googleFormUrl) {
  if (!booking.clientEmail) return;
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevunuz onaylandı',
    text: `${formatSlot(booking)} tarihindeki randevunuz onaylanmıştır.${
      googleFormUrl ? `\n\nHenüz doldurmadıysanız, lütfen ön görüşme formunu doldurun: ${googleFormUrl}` : ''
    }`,
  });
}

async function sendRejectedToClient(booking) {
  if (!booking.clientEmail) return;
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevu talebiniz hakkında',
    text: `Maalesef ${formatSlot(booking)} için talep ettiğiniz randevu saati uygun değildir.${
      booking.rejectionReason ? `\n\nNot: ${booking.rejectionReason}` : ''
    }\n\nLütfen başka bir zaman için yeni bir talep gönderin.`,
  });
}

module.exports = {
  sendNewRequestToPsychologist,
  sendApprovedToClient,
  sendRejectedToClient,
};
