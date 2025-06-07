const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Important: fail fast if MongoDB can't be reached
      socketTimeoutMS: 45000, // Timeout for sending/receiving from MongoDB
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Optional: stop the app if DB isn't connected
  }
};
