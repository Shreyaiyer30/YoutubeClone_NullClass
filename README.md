# YouTubeClone-NullClass

---

## 📌 Introduction

**YouTubeClone-NullClass** is a YouTube-inspired web application designed to enhance user engagement through gamification, advanced video interactions, and real-time communication features.

The project focuses on:

* User engagement
* Interactive video playback
* Monetization through subscription plans
* Real-time communication using VoIP

---

## ✨ Features

---

### 🎯 1. Points System

* Users earn **5 points** for every video watched
* Points are displayed in the **User Profile** section

---

### 🎥 2. Custom Gesture-Based Video Player

The video player supports advanced touch gestures:

* **Double Tap (Right):** Skip forward 10 seconds
* **Double Tap (Left):** Skip backward 10 seconds
* **Single Tap (Center):** Pause video
* **Three Taps (Center):** Play next video
* **Three Taps (Right):** Close the website
* **Three Taps (Left):** Open comments section
* **Single Tap (Top-Right):** Show current location & temperature
* **Hold (Right):** Play video at 2× speed
* **Hold (Left):** Play video at 0.5× speed

---

### 📞 3. VoIP Feature

* Video calling between users
* Screen sharing of the YouTube website
* Recording of video call sessions (saved locally)
* Calls allowed only between **6 PM – 12 AM**

---

## 🌐 Hosting & Deployment

---

### Frontend

* Hosted on **Vercel**

### Backend

* Hosted on **Render**

> ⚠️ **Note:** If the frontend does not load correctly, refresh the backend on Render due to free-tier limitations.

---

## ⚙️ Local Setup Instructions

---

### 🔹 Clone the Repository

```bash
git clone https://github.com/AthulTM/YouTubeClone-NullClass.git
cd YouTubeClone-NullClass
```

---

### 🔹 Frontend Setup

```bash
cd client
npm install
npm start
```

---

### 🔹 Backend Setup

```bash
cd server
npm install
npm start
```

---

## 🚀 Internship Enhancements Implemented

---

### 💬 Comment System

* Multilingual comments support
* Comment translation to preferred language
* Like and dislike options
* Auto-delete comments after **2 dislikes**
* Block comments with special characters
* Display **exact city name** with comments

---

### ⬇️ Video Download Feature

* Free users: **1 video download per day**
* Downloaded videos shown in **Profile → Downloads**
* Premium users: unlimited downloads
* Razorpay payment gateway (test mode)

---

### 💳 Subscription Plans

| Plan   | Watch Time Limit | Price |
| ------ | ---------------- | ----- |
| Free   | 5 minutes        | ₹0    |
| Bronze | 7 minutes        | ₹10   |
| Silver | 10 minutes       | ₹50   |
| Gold   | Unlimited        | ₹100  |

* Razorpay payment integration
* Invoice sent to user via email after successful payment

---

### 🎨 Dynamic Theme & Authentication

#### Theme Selection

* **White Theme**

  * Login between **10 AM – 12 PM**
  * Location: Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana

* **Dark Theme**

  * All other timings and locations

#### OTP Verification

* South India users → **Email OTP**
* Other states → **Mobile OTP**

---

## 🛠️ Technologies Used

* React.js
* Node.js & Express.js
* MongoDB
* WebRTC
* Razorpay
* Vercel & Render

---

## ✅ Conclusion

YouTubeClone-NullClass is a feature-rich full-stack application showcasing advanced frontend interactions, backend integrations, real-time communication, and monetization strategies.

This project demonstrates strong proficiency in:

* React development
* API design
* WebRTC implementation
* Payment gateway integration
* Cloud deployment
