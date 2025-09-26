// backend/models/Reminder.js
const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // every reminder must have a title
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  repeat: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly", "yearly"],
    default: "none"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Reminder", ReminderSchema);
