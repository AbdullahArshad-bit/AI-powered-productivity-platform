const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    registerUser, 
    loginUser, 
    verifyEmail, 
    resendVerificationCode,
    getMe,
    deleteMe,
    updateProfile,
    changePassword,
    getSettings,
    updateSettings
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

// Protected routes
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

module.exports = router;
