const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// 1. REGISTER FOR AN EVENT (Protected Route)
router.post('/', auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // Find event and check seats
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.seats <= 0) return res.status(400).json({ message: 'No seats available' });

    // Check if already registered
    const existingReg = await Registration.findOne({ user: userId, event: eventId });
    if (existingReg) return res.status(400).json({ message: 'You are already registered for this event' });

    // Create registration
    const registration = new Registration({ user: userId, event: eventId });
    await registration.save();

    // Decrease available seats by 1
    event.seats -= 1;
    await event.save();

    res.status(201).json({ message: 'Successfully registered for event!', registration });
  } catch (err) {
    res.status(500).json({ message: 'Error registering for event', error: err.message });
  }
});

// 2. GET CURRENT USER'S REGISTRATIONS (Protected Route)
router.get('/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching registrations', error: err.message });
  }
});

module.exports = router;