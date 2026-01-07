const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example, you can use any SMTP service)
const createTransporter = () => {
    // For Gmail, you need to use App Password: https://support.google.com/accounts/answer/185833
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your app password (not regular password)
        },
    });
};

// Alternative: Use SMTP (works with any email provider)
const createSMTPTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

const sendVerificationEmail = async (email, code) => {
    try {
        // Check if email configuration exists
        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASSWORD?.trim();
        
        if (!emailUser || emailUser === 'your-email@gmail.com' || !emailUser.includes('@')) {
            console.error('❌ EMAIL_USER is not properly configured');
            console.error('   Current value:', emailUser || 'NOT SET');
            throw new Error('EMAIL_USER is not configured in .env file. Please set your Gmail address.');
        }
        
        if (!emailPass || emailPass === 'your-app-password-here') {
            console.error('❌ EMAIL_PASSWORD is not properly configured');
            throw new Error('EMAIL_PASSWORD is not configured in .env file. Please set your Gmail App Password.');
        }
        
        console.log('✅ Email configuration found');
        console.log('   From email:', emailUser);

        console.log('📧 Attempting to send verification email...');
        console.log('From:', process.env.EMAIL_USER);
        console.log('To:', email);
        
        const transporter = process.env.SMTP_HOST 
            ? createSMTPTransporter() 
            : createTransporter();

        // Verify transporter connection first
        console.log('🔌 Verifying email connection...');
        await transporter.verify();
        console.log('✅ Email server connection verified');

        const mailOptions = {
            from: `"AI Task Assistant" <${emailUser}>`,
            to: email,
            subject: 'Verify Your Email - AI Task Assistant',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Verify Your Email</h1>
                        </div>
                        <div class="content">
                            <p>Hello!</p>
                            <p>Thank you for signing up for AI Task Assistant. Please verify your email address by entering the code below:</p>
                            
                            <div class="code-box">
                                <div class="code">${code}</div>
                            </div>
                            
                            <p>This code will expire in <strong>10 minutes</strong>.</p>
                            <p>If you didn't create an account, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} AI Task Assistant. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   To:', email);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('   Error code:', error.code);
        console.error('   Error response:', error.response);
        
        // Provide helpful error messages
        if (error.message.includes('EMAIL_USER') || error.message.includes('EMAIL_PASSWORD')) {
            throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
        } else if (error.code === 'EAUTH') {
            throw new Error('Email authentication failed. Check your EMAIL_USER and EMAIL_PASSWORD in .env file. For Gmail, use App Password, not regular password.');
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            throw new Error('Could not connect to email server. Check your internet connection and SMTP settings.');
        } else {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};

module.exports = { sendVerificationEmail };
