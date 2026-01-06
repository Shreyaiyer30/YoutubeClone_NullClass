// import jwt from "jsonwebtoken";
// import users from "../models/auth.js";
// import nodemailer from "nodemailer";

// const sendEmailOTP = async (email, otp) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Your OTP for Login",
//             text: `Your OTP is ${otp}`,
//         });
//         console.log(`OTP sent to ${email}: ${otp}`);
//     } catch (error) {
//         console.log("Email failed", error);
//         console.log(`Mock OTP for ${email}: ${otp}`);
//     }
// };

// const sendMobileOTP = (mobile, otp) => {
//     // Mock SMS
//     console.log(`Sending SMS to MOBILE (simulated): Your OTP is ${otp}`);
// };

// export const login = async (req, res) => {
//     const { email, name, region } = req.body;
//     console.log(email, name, region);
//     try {
//         const existingUser = await users.findOne({ email });
//         let user = existingUser;

//         if (!existingUser) {
//             try {
//                 const newUserData = { email };
//                 if (name) {
//                     newUserData.name = name;
//                 }
//                 user = await users.create(newUserData);
//             } catch (error) {
//                 return res.status(500).json({ mess: "Something went wrong..." });
//             }
//         }

//         // OTP Logic
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

//         user.otp = otp;
//         user.otpExpires = otpExpires;
//         await user.save();

//         const southStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
//         // Default to Mobile OTP if region is not South, or if region is missing/unknown (per prompt requirements?)
//         // Prompt: "if the user login from southern states... trigger an email... if other states... trigger through mobile number"

//         if (region && southStates.includes(region)) {
//             await sendEmailOTP(email, otp);
//             return res.status(200).json({ result: user, otpRequired: true, message: "OTP sent to Email" });
//         } else {
//             // Assume non-south or unknown = Mobile
//             // Since we don't have mobile number in req.body or DB usually (auth with email), we'll mock it or just log it.
//             sendMobileOTP("USER_MOBILE", otp);
//             return res.status(200).json({ result: user, otpRequired: true, message: "OTP sent to Mobile" });
//         }

//     } catch (error) {
//         res.status(500).json({ mess: "something went wrong..." });
//     }
// };

// export const verifyOTP = async (req, res) => {
//     const { userId, otp } = req.body;
//     try {
//         const user = await users.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         if (user.otp === otp && user.otpExpires > Date.now()) {
//             const token = jwt.sign(
//                 { email: user.email, id: user._id },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "1h" }
//             );

//             // Clear OTP
//             user.otp = undefined;
//             user.otpExpires = undefined;
//             await user.save();

//             res.status(200).json({ result: user, token });
//         } else {
//             res.status(400).json({ message: "Invalid or Expired OTP" });
//         }
//     } catch (error) {
//         res.status(500).json({ mess: "something went wrong..." });
//     }
// }

import jwt from "jsonwebtoken";
import User from "../models/auth.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate secure OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via Email
const sendEmailOTP = async (email, otp, userName = 'User') => {
    try {
        const mailOptions = {
            from: `"YouTube Clone" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Login OTP - YouTube Clone",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #FF0000, #CC0000); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">YouTube Clone</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9f9f9;">
                        <h2>Hello ${userName},</h2>
                        <p>Your One-Time Password (OTP) for login is:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="background: white; border: 2px dashed #FF0000; padding: 20px; display: inline-block;">
                                <h1 style="color: #FF0000; margin: 0; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                            </div>
                        </div>
                        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                        <p>If you didn't request this OTP, please ignore this email.</p>
                        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
                            <small>This is an automated message, please do not reply.</small>
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email OTP sent to ${email}: ${otp}`);
        return true;
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        // For development, log OTP even if email fails
        console.log(`📧 Mock OTP for ${email}: ${otp}`);
        return true; // Return true for development
    }
};

// Send OTP via SMS (Mock for now)
const sendMobileOTP = (mobile, otp, userName = 'User') => {
    // In production, integrate with SMS service like Twilio, MSG91, etc.
    console.log(`📱 SMS OTP to ${mobile}: Hello ${userName}, your OTP is ${otp}. Valid for 10 minutes.`);
    return true;
};

// Login - Step 1: Request OTP
export const login = async (req, res) => {
    try {
        const { email, name, region } = req.body;

        console.log("🔑 Login attempt:", { email, name, region });

        // Validate email
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Find or create user
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create new user
            user = new User({
                email: email.toLowerCase(),
                name: name || '',
                joinedOn: new Date()
            });
            await user.save();
            console.log("👤 New user created:", user._id);
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is temporarily blocked. Please contact support."
            });
        }

        // Check OTP attempts (rate limiting)
        if (user.otpAttempts >= 5) {
            user.isBlocked = true;
            await user.save();
            return res.status(429).json({
                success: false,
                message: "Too many OTP attempts. Account temporarily blocked."
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.otpAttempts = (user.otpAttempts || 0) + 1;
        await user.save();

        console.log("🔢 OTP generated for user:", user._id, otp);

        // Define south Indian states
        const southStates = [
            "Tamil Nadu",
            "Kerala",
            "Karnataka",
            "Andhra Pradesh",
            "Telangana",
            "Puducherry"
        ];

        let deliveryMethod = "email";
        let message = "OTP sent to your email";

        // Determine delivery method based on region
        if (region && southStates.includes(region)) {
            // South India: Send via Email
            await sendEmailOTP(email, otp, user.name || name);
            deliveryMethod = "email";
            message = "OTP sent to your email";
        } else {
            // Other regions: Send via SMS
            // For now, we'll use mobile from user profile or mock
            const mobile = user.mobile || "9999999999"; // Mock number
            sendMobileOTP(mobile, otp, user.name || name);
            deliveryMethod = "sms";
            message = "OTP sent to your mobile";
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: message,
            otpRequired: true,
            deliveryMethod: deliveryMethod,
            userId: user._id,
            otpExpires: otpExpires,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
};

// Verify OTP - Step 2: Validate OTP
export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        console.log("✅ OTP verification attempt:", { userId, otp });

        if (!userId || !otp) {
            return res.status(400).json({
                success: false,
                message: "User ID and OTP are required"
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked. Please contact support."
            });
        }

        // Check if OTP exists and is not expired
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: "No active OTP found. Please request a new OTP."
            });
        }

        if (user.otpExpires < new Date()) {
            // Clear expired OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }

        // Verify OTP
        if (user.otp !== otp) {
            // Increment failed attempts
            user.otpAttempts = (user.otpAttempts || 0) + 1;

            // Block after 5 failed attempts
            if (user.otpAttempts >= 5) {
                user.isBlocked = true;
                await user.save();
                return res.status(429).json({
                    success: false,
                    message: "Too many failed attempts. Account has been blocked."
                });
            }

            await user.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again.",
                attemptsLeft: 5 - user.otpAttempts
            });
        }

        // OTP is valid - Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET || "your_jwt_secret_key",
            { expiresIn: "7d" } // Token valid for 7 days
        );

        // Update user record
        user.lastLogin = new Date();
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpAttempts = 0; // Reset attempts on successful login
        await user.save();

        console.log("🎉 OTP verified successfully for user:", user._id);

        // Prepare user data for response
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            about: user.about,
            tags: user.tags,
            joinedOn: user.joinedOn,
            profilePicture: user.profilePicture,
            role: user.role
        };

        // Return success response
        res.status(200).json({
            success: true,
            message: "Login successful!",
            token: token,
            result: userData
        });

    } catch (error) {
        console.error("❌ OTP verification error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during OTP verification."
        });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked. Please contact support."
            });
        }

        // Rate limiting for OTP resend
        if (user.otp && user.otpExpires > new Date()) {
            const timeLeft = Math.ceil((user.otpExpires - new Date()) / 1000);
            if (timeLeft > 300) { // 5 minutes
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${Math.ceil(timeLeft / 60)} minutes before requesting a new OTP.`
                });
            }
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via email (default method for resend)
        await sendEmailOTP(email, otp, user.name);

        res.status(200).json({
            success: true,
            message: "New OTP sent successfully",
            userId: user._id,
            otpExpires: otpExpires
        });

    } catch (error) {
        console.error("❌ Resend OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to resend OTP"
        });
    }
};

// Get user profile (protected route)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-otp -otpExpires -otpAttempts');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error("❌ Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, about, tags, mobile } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields if provided
        if (name !== undefined) user.name = name;
        if (about !== undefined) user.about = about;
        if (tags !== undefined) user.tags = tags;
        if (mobile !== undefined) user.mobile = mobile;

        await user.save();

        // Return updated user (excluding sensitive data)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            about: user.about,
            tags: user.tags,
            mobile: user.mobile,
            joinedOn: user.joinedOn,
            profilePicture: user.profilePicture
        };

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: userData
        });

    } catch (error) {
        console.error("❌ Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};