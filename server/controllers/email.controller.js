const Email = require('../models/Email');
const { sendEmail } = require('../utils/emailSender');

const getEmailsByEvent = async (req, res, next) => {
  try {
    const emails = await Email.find({ eventId: req.params.eventId });
    res.json({ success: true, emails });
  } catch (error) {
    next(error);
  }
};

const updateEmail = async (req, res, next) => {
  try {
    const email = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found.' });
    }
    res.json({ success: true, email });
  } catch (error) {
    next(error);
  }
};

const sendEmailDraft = async (req, res, next) => {
  try {
    const { recipientEmail } = req.body;
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found.' });
    }

    if (!recipientEmail) {
      return res.status(400).json({ success: false, message: 'Recipient email is required.' });
    }

    try {
      await sendEmail(recipientEmail, email.subject, email.body);
      email.status = 'sent';
      email.sentAt = new Date();
      email.recipientEmail = recipientEmail;
      await email.save();
      res.json({ success: true, message: 'Email sent successfully.', email });
    } catch (sendError) {
      email.status = 'failed';
      await email.save();
      return res.status(500).json({ success: false, message: 'Failed to send email: ' + sendError.message });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getEmailsByEvent, updateEmail, sendEmailDraft };
