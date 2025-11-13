const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    // Create user
    const user = await User.create({
      username: req.body.email.split('@')[0], // Generate username from email
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    // Create profile for the user
    await db.profile.create({
      userId: user.id,
      firstName: req.body.name?.split(' ')[0] || '',
      lastName: req.body.name?.split(' ').slice(1).join(' ') || ''
    });

    res.status(200).send({
      message: "User registered successfully!",
      userId: user.id
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    // Update last login time
    await User.update(
      { lastLogin: new Date() },
      { where: { id: user.id } }
    );

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).send({ message: "Refresh Token is required!" });
  }

  try {
    const user = jwt.verify(requestToken, config.refreshTokenSecret);
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration
    });

    return res.status(200).send({
      accessToken: token,
      refreshToken: requestToken
    });
  } catch (err) {
    return res.status(403).send({
      message: "Invalid refresh token"
    });
  }
};
