const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Project = require('../models/Project');
const Tag = require('../models/Tag');
const TimeLog = require('../models/TimeLog');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { validatePassword } = require('../utils/passwordValidator');
const { sendVerificationEmail } = require('../utils/emailService');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                message: 'Password validation failed',
                errors: passwordValidation.errors 
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists. Please use a different email or login.' });
        }

        // Generate 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        // Save or update email verification
        await EmailVerification.findOneAndUpdate(
            { email },
            {
                email,
                code: verificationCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
                verified: false,
            },
            { upsert: true, new: true }
        );

        // Send verification email
        let emailSent = false;
        try {
            console.log('📧 Attempting to send verification email to:', email);
            await sendVerificationEmail(email, verificationCode);
            emailSent = true;
            console.log('✅ Email sent successfully!');
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            console.error('   Full error:', emailError);
            // Still allow registration, but log the error clearly
            emailSent = false;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (but mark as unverified)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isEmailVerified: false, // Add this field to User model
        });

            if (emailSent) {
            res.status(201).json({
                message: 'Registration successful! Please check your email for verification code.',
                userId: user._id,
                email: user.email,
                requiresVerification: true,
            });
        } else {
            // If email not sent, mark user as verified temporarily so they can use the app
            // Admin can configure email later and users can verify then
            user.isEmailVerified = true;
            await user.save();
            
            res.status(201).json({
                message: 'Registration successful! Email verification is temporarily disabled. You can login now.',
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                requiresVerification: false,
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const verification = await EmailVerification.findOne({ 
            email, 
            code,
            verified: false,
            expiresAt: { $gt: new Date() } // Not expired
        });

        if (!verification) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Mark verification as used
        verification.verified = true;
        await verification.save();

        // Update user email verification status
        const user = await User.findOneAndUpdate(
            { email },
            { isEmailVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Email verified successfully!',
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: error.message || 'Email verification failed' });
    }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new code
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        // Update verification record
        await EmailVerification.findOneAndUpdate(
            { email },
            {
                code: verificationCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
                verified: false,
            },
            { upsert: true, new: true }
        );

        // Send email
        await sendVerificationEmail(email, verificationCode);

        res.json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: error.message || 'Failed to resend verification code' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ 
                message: 'Please verify your email before logging in',
                requiresVerification: true,
                email: user.email
            });
        }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to get user profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name } = req.body;
        const userId = req.user.id || req.user._id;

        console.log('Update profile request:', { userId, name });

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name: name.trim() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Profile updated successfully:', user.name);

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: error.message || 'Failed to update profile' });
    }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id || req.user._id;

        console.log('Change password request for user:', userId);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                message: 'Password validation failed',
                errors: passwordValidation.errors 
            });
        }

        // Get user with password (need to select password field)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            console.log('Password verification failed for user:', userId);
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        console.log('Password changed successfully for user:', userId);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: error.message || 'Failed to change password' });
    }
};

// @desc    Get user settings
// @route   GET /api/auth/settings
// @access  Private
const getSettings = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId).select('settings notifications');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            settings: user.settings || {},
            notifications: user.notifications || {
                emailNotifications: true,
                taskReminders: true,
                projectUpdates: true,
                weeklyReports: false
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to get settings' });
    }
};

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = async (req, res) => {
    try {
        const { notifications, settings } = req.body;
        const userId = req.user.id || req.user._id;

        const updateData = {};
        if (notifications) {
            updateData.notifications = notifications;
        }
        if (settings) {
            updateData.settings = { ...updateData.settings, ...settings };
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Settings updated successfully',
            settings: user.settings || {},
            notifications: user.notifications || {}
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: error.message || 'Failed to update settings' });
    }
};

// @desc    Delete current user account and data
// @route   DELETE /api/auth/me
// @access  Private
const deleteMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId).select('email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete related data first (best-effort cleanup)
        await Promise.all([
            Task.deleteMany({ user: userId }),
            Note.deleteMany({ user: userId }),
            Project.deleteMany({ user: userId }),
            Tag.deleteMany({ user: userId }),
            TimeLog.deleteMany({ user: userId }),
            EmailVerification.deleteMany({ email: user.email }),
        ]);

        await User.findByIdAndDelete(userId);

        return res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({ message: error.message || 'Failed to delete account' });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    verifyEmail, 
    resendVerificationCode,
    getMe,
    updateProfile,
    changePassword,
    getSettings,
    updateSettings,
    deleteMe
};
