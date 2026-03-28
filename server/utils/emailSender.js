const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

/**
 * Send a single email
 * @param {string} to - recipient email address
 * @param {string} subject - email subject
 * @param {string} body - plain text body
 * @returns {Promise<object>} - nodemailer info object
 */
const sendEmail = async (to, subject, body) => {
  const htmlBody = body
    .split('\n')
    .map(line => line.trim() === '' ? '<br/>' : `<p style="margin:0 0 8px 0;">${line}</p>`)
    .join('');

  const mailOptions = {
    from: `EventOS <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: body,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6c3be6; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">EventOS</h2>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
          ${htmlBody}
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 16px;">
          Powered by EventOS — AI Event Operating System
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send registration confirmation email
 */
const sendConfirmationEmail = async (registration, event) => {
  const subject = `Registration Confirmed — ${event.name}`;
  const body = `Hi ${registration.name},

Your registration for ${event.name} has been confirmed!

Event Details:
• Date: ${new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'full' })}
• Venue: ${event.location}, ${event.city}
• Theme: ${event.theme || 'TBA'}

You have registered ${registration.numberOfPeople} spot(s).

Please arrive 15 minutes before the event starts. We look forward to seeing you!

Regards,
The ${event.name} Team

Powered by EventOS`;

  return sendEmail(registration.email, subject, body);
};

module.exports = { sendEmail, sendConfirmationEmail };
