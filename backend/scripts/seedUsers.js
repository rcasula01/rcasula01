require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});

    // Create default users using .save() to trigger password hashing
    const adminUser = new User({
      username: "admin",
      email: "admin@blinkfind.com",
      password: "school123",
      role: "admin"
    });

    const guestUser = new User({
      username: "guest",
      email: "guest@blinkfind.com",
      password: "guest123",
      role: "guest"
    });

    await adminUser.save();
    await guestUser.save();

    console.log("✅ Seeded users successfully:");
    console.log(`   - admin (admin)`);
    console.log(`   - guest (guest)`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedUsers();
