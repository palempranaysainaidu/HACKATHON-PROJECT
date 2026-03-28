const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { sendConfirmationEmail } = require('../utils/emailSender');

const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { name, email, phone, organization, numberOfPeople } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const registration = await Registration.create({
      eventId,
      name,
      email,
      phone,
      organization,
      numberOfPeople: numberOfPeople || 1
    });

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(registration, event)
      .then(async () => {
        await Registration.findByIdAndUpdate(registration._id, { confirmationEmailSent: true });
      })
      .catch((err) => console.error('Confirmation email failed:', err.message));

    res.status(201).json({ success: true, registration });
  } catch (error) {
    next(error);
  }
};

const getRegistrationsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ eventId }).sort({ registeredAt: -1 });
    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerForEvent, getRegistrationsByEvent };
