// import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//     email: { type: String, require: true },
//     name: { type: String },
//     desc: { type: String },
//     joinedOn: { type: Date, default: Date.now },
//     viewedVideos: { type: [mongoose.Schema.Types.ObjectId], ref: 'videoFiles', default: [] },
//     plan: { type: String, enum: ["Free", "Bronze", "Silver", "Gold"], default: "Free" },
//     downloadCount: { type: Number, default: 0 },
//     lastDownloadDate: { type: Date, default: null },
//     otp: { type: String },
//     otpExpires: { type: Date }
// })

// export default mongoose.model("User", userSchema)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    about: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    mobile: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    joinedOn: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.model("User", userSchema);

export default User;