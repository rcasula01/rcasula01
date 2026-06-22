const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Protected routes
router.get("/me", authenticateToken, authController.getCurrentUser);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;