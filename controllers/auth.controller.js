const db = require("../models");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = db.user;
const Profile = db.profile;

// Helper function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.secret, {
    expiresIn: config.jwtExpiration
  });
};

// Helper function to generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.secret, {
    expiresIn: config.jwtRefreshExpiration
  });
};

// Sign up
exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use"
      });
    }

    const existingUsername = await User.findOne({
      where: {
        username: username
      }
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create user
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      isActive: true
    });

    // Create default profile
    await Profile.create({
      userId: user.id,
      age: 0,
      gender: "not_specified",
      weight: 0,
      height: 0,
      activityLevel: "moderate",
      goal: "maintenance"
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Error during signup",
      error: error.message
    });
  }
};

// Sign in
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated"
      });
    }

    // Verify password
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Error during signin",
      error: error.message
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({
        message: "Refresh token is required"
      });
    }

    jwt.verify(refreshToken, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid refresh token"
        });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(decoded.id);

      res.status(200).json({
        accessToken: newAccessToken
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      message: "Error refreshing token",
      error: error.message
    });
  }
};
