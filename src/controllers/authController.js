const userService = require("../services/userService");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    await userService.registerUser(name, email, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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