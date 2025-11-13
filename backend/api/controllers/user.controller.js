const db = require("../models");
const User = db.user;
const Profile = db.profile;

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Profile,
        as: "profile"
      }]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // Update profile
    await Profile.update(req.body, {
      where: { userId: req.userId }
    });

    res.status(200).send({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    
    const bcrypt = require("bcryptjs");
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Current password is incorrect!" });
    }
    
    // Update password
    await User.update(
      { password: bcrypt.hashSync(newPassword, 8) },
      { where: { id: req.userId } }
    );
    
    res.status(200).send({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
