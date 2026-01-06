YouTubeClone-NullClass
Introduction

YouTubeClone-NullClass is a YouTube-inspired web application developed to enhance user engagement through gamification, advanced video interactions, and real-time communication. The project integrates a points-based reward system, a custom gesture-controlled video player, and VoIP functionality for video calling and screen sharing.

Features
1. Points System

Users earn 5 points for each video watched

Points are displayed in the user profile

2. Custom Gesture-Based Video Player

The video player supports the following gestures:

Double tap (Right): Skip forward 10 seconds

Double tap (Left): Skip backward 10 seconds

Single tap (Center): Pause video

Three taps (Center): Play next video

Three taps (Right): Close website

Three taps (Left): Open comments section

Single tap (Top-right): Show current location & temperature

Hold (Right): Play at 2× speed

Hold (Left): Play at 0.5× speed

3. VoIP Feature

Video calling between users

Screen sharing of the YouTube website

Recording functionality (saved locally)

Calls allowed only between 6 PM – 12 AM

Hosting & Deployment
Frontend

Hosted on Vercel

Backend

Hosted on Render

Note: If the frontend does not load correctly, refresh the backend service on Render due to free-tier limitations.

Local Setup Instructions
Clone Repository
git clone https://github.com/AthulTM/YouTubeClone-NullClass.git
cd YouTubeClone-NullClass

Frontend Setup
cd client
npm install
npm start

Backend Setup
cd server
npm install
npm start

Internship Enhancements Implemented
Comment System

Multilingual comments with translation option

Like and dislike functionality

Auto-delete comments with 2 dislikes

Reject comments containing special characters

Display exact city name with comments

Video Download Feature

Free users: 1 video per day

Downloaded videos shown in User Profile → Downloads

Premium users: unlimited downloads

Razorpay test payment integration

Subscription Plans
Plan	Watch Time Limit	Price
Free	5 minutes	₹0
Bronze	7 minutes	₹10
Silver	10 minutes	₹50
Gold	Unlimited	₹100

Payment via Razorpay

Invoice email sent after successful payment

Dynamic Theme & Authentication

White theme:

Login time between 10 AM – 12 PM

User location in South India (Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana)

Dark theme: All other cases

OTP Verification

South India users → Email OTP

Other states → Mobile OTP

Technologies Used

React.js

Node.js & Express.js

MongoDB

WebRTC

Razorpay

Vercel & Render

Conclusion

YouTubeClone-NullClass demonstrates a modern full-stack application with advanced UX features, real-time communication, monetization models, and cloud deployment. The project highlights strong skills in React, backend APIs, WebRTC, and payment gateway integration.
