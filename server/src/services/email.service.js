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

// A short, human display for a link, since raw URLs (especially Google Form
// URLs with long query strings) are visually noisy in an email body.
function shortenUrlForDisplay(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

async function sendNewRequestToPsychologist(booking) {
  if (!config.psychologistEmail) return;
  await send({
    to: config.psychologistEmail,
    from: config.emailFrom,
    subject: 'Yeni randevu talebi',
    text: `Merhaba,\n\n${booking.clientName} (${booking.clientEmail}) ${formatSlot(
      booking
    )} için bir randevu talebinde bulundu.\n\nKonu: ${booking.topic || '-'}\nNot: ${
      booking.notes || '-'
    }\n\nDilediğiniz zaman yönetim panelinden inceleyip yanıtlayabilirsiniz.\n\nİyi çalışmalar.`,
  });
}

async function sendApprovedToClient(booking, googleFormUrl) {
  if (!booking.clientEmail) return;
  const formLinkText = googleFormUrl
    ? `\n\nSüreç öncesinde sizi biraz daha iyi tanıyabilmemiz için, vaktiniz olduğunda ön görüşme formunu doldurmanızı rica ederiz: ${shortenUrlForDisplay(
        googleFormUrl
      )}`
    : '';
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevunuz onaylandı',
    text: `Merhaba,\n\n${formatSlot(
      booking
    )} tarihindeki randevunuz onaylanmıştır. Görüşmek üzere sizi ağırlamaktan memnuniyet duyacağım.${formLinkText}\n\nİyi günler dilerim.`,
    ...(googleFormUrl && {
      html: `<p>Merhaba,</p><p>${formatSlot(
        booking
      )} tarihindeki randevunuz onaylanmıştır. Görüşmek üzere sizi ağırlamaktan memnuniyet duyacağım.</p><p>Süreç öncesinde sizi biraz daha iyi tanıyabilmemiz için, vaktiniz olduğunda ön görüşme formunu doldurmanızı rica ederiz: <a href="${googleFormUrl}">${shortenUrlForDisplay(
        googleFormUrl
      )}</a></p><p>İyi günler dilerim.</p>`,
    }),
  });
}

async function sendRejectedToClient(booking) {
  if (!booking.clientEmail) return;
  await send({
    to: booking.clientEmail,
    from: config.emailFrom,
    subject: 'Randevu talebiniz hakkında',
    text: `Merhaba,\n\nMaalesef ${formatSlot(
      booking
    )} için talep ettiğiniz randevu saati şu an uygun değil.${
      booking.rejectionReason ? `\n\nNot: ${booking.rejectionReason}` : ''
    }\n\nAnlayışınız için teşekkür ederim; size uygun başka bir zaman için yeni bir talep gönderebilirsiniz.\n\nİyi günler dilerim.`,
  });
}

module.exports = {
  sendNewRequestToPsychologist,
  sendApprovedToClient,
  sendRejectedToClient,
};
