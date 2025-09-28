const express = require("express");
const auth = require("../middleware/auth");
const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  toggleReminder,
} = require("../controllers/reminderController");

const router = express.Router();

// All routes require authentication
router.use((req, res, next) => {
  console.log('Reminder routes middleware - Request received:', req.method, req.path);
  next();
});

router.use(auth);

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

// @route   PATCH /api/reminders/:id/done
// @desc    Toggle reminder completion
router.patch('/:id/done', toggleReminder);

module.exports = router;