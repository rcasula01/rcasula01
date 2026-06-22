const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = "24h";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required"
      });
    }

    // Find user and include password field (it's excluded by default)
    const user = await User.findOne({ username }).select("+password");

    // User doesn't exist
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password"
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(401).json({
        success: false,
        error: "Account is locked. Try again later."
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account is inactive. Contact administrator."
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        error: "Invalid username or password"
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate token
    const token = generateToken(user);

    // Determine redirect URL based on role
    const redirectUrl = user.role === "admin" ? "./home.html" : "./home_guest.html";

    res.json({
      success: true,
      token,
      username: user.username,
      role: user.role,
      redirectUrl
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login"
    });
  }
};

// Register Controller
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Username, email, and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username or email already exists"
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || "user"
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      username: user.username,
      role: user.role,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error during registration"
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// Logout (client-side, but can be used for backend cleanup if needed)
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};