const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const users = [
      {
        username: "admin",
        password: "password",
        fullName: "System Admin",
        role: "Admin",
      },
      {
        username: "manager",
        password: "password",
        fullName: "Sales Manager",
        role: "Sales Manager",
      },
      {
        username: "executive",
        password: "password",
        fullName: "Sales Executive",
        role: "Sales Executive",
      },
    ];

    for (const user of users) {
      const exists = await User.findOne({ username: user.username });

      if (exists) {
        console.log(`${user.username} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        username: user.username,
        password: hashedPassword,
        fullName: user.fullName,
        role: user.role,
      });

      console.log(`${user.username} created`);
    }

    console.log("Done");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });