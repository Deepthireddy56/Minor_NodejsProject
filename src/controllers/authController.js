const userService = require("../services/userService");

async function register(req, res) {
  try {
    const user = await userService.registerUser(req.body); 
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    const token = userService.generateAuthToken(user);
    
    res.json({ 
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = { register, login };