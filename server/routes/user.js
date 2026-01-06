// import express from 'express'

// import {login} from '../controllers/auth.js'
// import {updateChanelData,getAllChanels} from '../controllers/chanel.js'



// const routes = express.Router();

// routes.post('/login',login)
// routes.patch('/update/:id',updateChanelData)
// routes.get('/getAllChanels',getAllChanels)

// export default routes;

import express from "express";
import {
    login,
    verifyOTP,
    resendOTP,
    getProfile,
    updateProfile
} from "../controllers/auth.js";
import { getAllChanels, updateChanelData } from "../controllers/chanel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Protected routes
router.get("/profile", verifyToken, getProfile);
router.patch("/update-profile", verifyToken, updateProfile);

// Get all channels
router.get('/getAllChanels', getAllChanels);
router.patch('/update/:id', updateChanelData);

// Get all users (for testing)
router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select('-otp -otpExpires -otpAttempts');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;