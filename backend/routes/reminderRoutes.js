// backend/routes/reminderRoutes.js
const express = require("express");
const Reminder = require("../models/Reminder");
const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

const router = express.Router();

// @route   POST /api/reminders
// @desc    Create a new reminder
router.post("/", createReminder);

// @route   GET /api/reminders
// @desc    Get all reminders
router.get("/", getReminders);

// @route   PUT /api/reminders/:id
// @desc    Update a reminder by ID
router.put("/:id", updateReminder);

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder by ID
router.delete("/:id", deleteReminder);

// PATCH /api/reminders/:id/done
router.patch('/:id/done', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    reminder.completed = !reminder.completed; // toggle done/undone
    await reminder.save();

    res.json({ message: 'Reminder updated', reminder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;