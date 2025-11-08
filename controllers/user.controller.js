const db = require("../models");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = db.user;
const Profile = db.profile;

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Profile,
        as: 'profile'
      }]
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Error retrieving profile",
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      age,
      gender,
      weight,
      height,
      activityLevel,
      goal,
      dietaryRestrictions,
      allergies,
      healthConditions
    } = req.body;

    // Find or create profile
    let profile = await Profile.findOne({
      where: { userId: userId }
    });

    if (!profile) {
      profile = await Profile.create({
        userId: userId,
        age: age || 0,
        gender: gender || 'not_specified',
        weight: weight || 0,
        height: height || 0,
        activityLevel: activityLevel || 'moderate',
        goal: goal || 'maintenance',
        dietaryRestrictions: dietaryRestrictions || [],
        allergies: allergies || [],
        healthConditions: healthConditions || []
      });
    } else {
      // Update existing profile
      await profile.update({
        age: age !== undefined ? age : profile.age,
        gender: gender !== undefined ? gender : profile.gender,
        weight: weight !== undefined ? weight : profile.weight,
        height: height !== undefined ? height : profile.height,
        activityLevel: activityLevel !== undefined ? activityLevel : profile.activityLevel,
        goal: goal !== undefined ? goal : profile.goal,
        dietaryRestrictions: dietaryRestrictions !== undefined ? dietaryRestrictions : profile.dietaryRestrictions,
        allergies: allergies !== undefined ? allergies : profile.allergies,
        healthConditions: healthConditions !== undefined ? healthConditions : profile.healthConditions
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: profile
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long"
      });
    }

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Verify current password
    const passwordIsValid = await bcrypt.compare(currentPassword, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update password
    await user.update({ password: hashedPassword });

    res.status(200).json({
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      message: "Error updating password",
      error: error.message
    });
  }
};
