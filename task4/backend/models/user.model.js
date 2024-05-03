const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    lastLoginTime: { type: Date },
    registrationTime: { type: Date, default: Date.now },
	status: { type: String, default: 'active' }
  })
);

module.exports = User;