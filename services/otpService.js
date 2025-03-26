const otpGenerator = require('otp-generator');  // OTP generation library
const User = require('./../models/User');    // User model
const sendOtpToUser = require('./../utils/sendOtp'); // Correct path for OTP sending utility

// Function to generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false, digits: true });
};

// Function to send OTP to the user via email
const sendOtp = async (email) => {
    const otp = generateOTP();

    // Set OTP expiry time (10 minutes in this case)
    const otpExpiry = Date.now() + 10 * 60 * 1000;  // OTP expires in 10 minutes

    // Save OTP and expiry time in the database for the user
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, otp, otpExpiry });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        await user.save();

        // Send OTP via email using the utility function
        sendOtpToUser(email, otp);  // Send OTP to the provided email address

        return { message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Error sending OTP');
    }
};

// Function to verify OTP
const verifyOTP = async (email, enteredOtp) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if OTP is expired
        if (user.otpExpiry < Date.now()) {
            throw new Error('OTP has expired');
        }

        // Verify if entered OTP matches the stored OTP
        if (user.otp !== enteredOtp) {
            throw new Error('Invalid OTP');
        }

        // OTP is valid, clear the OTP fields after successful verification
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return { message: 'OTP verified successfully' };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new Error(error.message);
    }
};

module.exports = { sendOtp, verifyOTP };
