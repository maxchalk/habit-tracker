const express = require("express");
const { register, login } = require("../controllers/authController");
const { validateRegistration, validateLogin, handleValidationErrors } = require("../middleware/validation");
const { authLimiter } = require("../middleware/security");

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", validateRegistration, handleValidationErrors, register);

// @route   POST /api/auth/login
// @desc    Login user
router.post("/login", validateLogin, handleValidationErrors, login);

module.exports = router;