require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});

    // Create default users
    const users = [
      {
        username: "admin",
        email: "admin@blinkfind.com",
        password: "school123",
        role: "admin"
      },
      {
        username: "guest",
        email: "guest@blinkfind.com",
        password: "guest123",
        role: "guest"
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Seeded users successfully:");
    createdUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.role})`);
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
