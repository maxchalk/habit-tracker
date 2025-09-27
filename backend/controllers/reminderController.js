// backend/controllers/reminderController.js
const Reminder = require("../models/Reminder");

// CREATE a new reminder
const createReminder = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!req.body.date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(400).json({ message: error.message });
  }
};

// READ all reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

// UPDATE a reminder by ID
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json(reminder);
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE a reminder by ID
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
};