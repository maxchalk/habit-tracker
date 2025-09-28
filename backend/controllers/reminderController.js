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

    // Add user to reminder
    const reminderData = {
      ...req.body,
      user: req.user._id
    };

    const reminder = new Reminder(reminderData);
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
    console.log('getReminders - req.user:', req.user);
    console.log('getReminders - req.user._id:', req.user?._id);
    
    if (!req.user || !req.user._id) {
      console.log('getReminders - No user or user._id found');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const reminders = await Reminder.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log('getReminders - Found reminders:', reminders.length);
    res.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

// UPDATE a reminder by ID
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
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
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
};

// TOGGLE reminder completion
const toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.completed = !reminder.completed; // toggle done/undone
    await reminder.save();

    res.json({ message: 'Reminder updated', reminder });
  } catch (error) {
    console.error("Error toggling reminder:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  toggleReminder,
};