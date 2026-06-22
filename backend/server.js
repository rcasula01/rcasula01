const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Protected route example
const { authenticateToken } = require("./middleware/auth");

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: `Hello ${req.user.username}`
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});