const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("password", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      fullName: "Administrator",
      role: "Admin",
    });

    console.log("Admin account created successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();