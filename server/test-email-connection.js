require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== Testing Email Connection ===\n');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;

console.log('Configuration:');
console.log('EMAIL_USER:', emailUser || 'NOT SET');
console.log('EMAIL_PASSWORD:', emailPass ? (emailPass.length + ' characters') : 'NOT SET');
console.log('');

if (!emailUser || emailUser === 'your-email@gmail.com') {
    console.error('❌ EMAIL_USER is not configured');
    process.exit(1);
}

if (!emailPass || emailPass === 'your-app-password-here') {
    console.error('❌ EMAIL_PASSWORD is not configured');
    process.exit(1);
}

console.log('Creating email transporter...');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

console.log('Testing connection...\n');

// Test connection
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Connection Failed!');
        console.error('Error:', error.message);
        console.error('Error Code:', error.code);
        console.error('');
        
        if (error.code === 'EAUTH') {
            console.error('💡 This is an authentication error.');
            console.error('   Possible causes:');
            console.error('   1. Wrong email address');
            console.error('   2. Wrong App Password (not regular password)');
            console.error('   3. 2-Step Verification not enabled');
            console.error('   4. App Password expired or revoked');
            console.error('');
            console.error('   Solution:');
            console.error('   1. Go to: https://myaccount.google.com/apppasswords');
            console.error('   2. Generate a NEW App Password');
            console.error('   3. Make sure 2-Step Verification is enabled');
            console.error('   4. Update .env file with new password');
        } else if (error.code === 'ECONNECTION') {
            console.error('💡 Connection error - check internet connection');
        } else {
            console.error('💡 Error details:', error);
        }
        process.exit(1);
    } else {
        console.log('✅ Connection Successful!');
        console.log('   Email service is ready to send emails');
        console.log('');
        console.log('Testing email send...');
        
        const testCode = '123456';
        transporter.sendMail({
            from: `"AI Task Assistant" <${emailUser}>`,
            to: emailUser, // Send to self for testing
            subject: 'Test Email - AI Task Assistant',
            text: `Test verification code: ${testCode}`,
            html: `<h2>Test Email</h2><p>Your test code is: <strong>${testCode}</strong></p>`,
        })
        .then((info) => {
            console.log('✅ Test email sent successfully!');
            console.log('   Message ID:', info.messageId);
            console.log('   Check your inbox:', emailUser);
            process.exit(0);
        })
        .catch((sendError) => {
            console.error('❌ Failed to send test email');
            console.error('Error:', sendError.message);
            console.error('Error Code:', sendError.code);
            process.exit(1);
        });
    }
});
