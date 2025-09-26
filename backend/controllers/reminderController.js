// backend/controllers/reminderController.js
const Reminder = require("../models/Reminder");

// CREATE a new reminder
const createReminder = async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ all reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a reminder by ID
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a reminder by ID
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
};
