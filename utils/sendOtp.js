const nodemailer = require('nodemailer');

// Create a transporter for sending emails using your email provider
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use another email service like SendGrid, Mailgun, etc.
    auth: {
        user: 'your_email@gmail.com',  // Your email address
        pass: 'your_email_password'    // Your email password or app-specific password
    }
});

// Function to send OTP via email
const sendOtpToUser = (email, otp) => {
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Your OTP for Login/Registration',
        text: `Your OTP code is: ${otp}\nThis OTP is valid for the next 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP:', error);
        } else {
            console.log('OTP sent successfully:', info.response);
        }
    });
};

module.exports = sendOtpToUser;
