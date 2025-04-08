const User = require("../models/user");
const jwt = require('jsonwebtoken');

async function registerUser(name, email, password) {
  const user = new User({ name, email, password });
  return await user.save();
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  return user;
}

function generateAuthToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { registerUser, loginUser, generateAuthToken };
