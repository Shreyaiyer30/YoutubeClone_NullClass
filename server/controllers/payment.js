import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/auth.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_S0GtaBV0jrZAxD',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'nyBzlY6BixO2NoBQgpb30Gny',
});

const sendInvoice = async (email, plan, amount, orderId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or configured service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Invoice for ${plan} Plan Subscription`,
            html: `
                <h1>Payment Successful</h1>
                <p>Thank you for subscribing to the <b>${plan}</b> plan.</p>
                <p>Order ID: ${orderId}</p>
                <p>Amount Paid: ₹${amount}</p>
                <p>Enjoy your premium benefits!</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

export const createOrder = async (req, res) => {
    try {
        const { plan, amount } = req.body;
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const verifyOrder = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            plan,
            userId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'nyBzlY6BixO2NoBQgpb30Gny')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update User Plan
            const updatedUser = await User.findByIdAndUpdate(userId, {
                $set: { plan: plan }
            }, { new: true });

            // Send Invoice
            if (updatedUser) {
                // Determine amount based on plan for invoice (optional lookup, or pass from frontend)
                let amount = 0;
                if (plan === 'Bronze') amount = 10;
                if (plan === 'Silver') amount = 50;
                if (plan === 'Gold') amount = 100;

                await sendInvoice(updatedUser.email, plan, amount, razorpay_order_id);
            }

            return res.status(200).json({ message: "Payment verified successfully", result: updatedUser });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error);
    }
};
