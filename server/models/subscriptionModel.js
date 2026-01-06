import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    Subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    notifications: {
        type: Boolean,
        default: true
    }
});

// Create compound index to ensure unique subscriptions
subscriptionSchema.index({ Subscriber: 1, Channel: 1 }, { unique: true });

export default mongoose.model('Subscription', subscriptionSchema);