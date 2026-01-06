import Subscription from '../models/subscriptionModel.js';


export const subscribeController = async (req, res) => {
    const { channelId } = req.body;
    const userId = req.userId;

    // console.log("Subscribe:", userId, channelId);

    try {
        const existingSubscription = await Subscription.findOne({
            Subscriber: userId,
            Channel: channelId
        });

        if (existingSubscription) {
            return res.status(400).json({ message: "Already subscribed" });
        }

        const newSubscription = new Subscription({
            Subscriber: userId,
            Channel: channelId
        });

        await newSubscription.save();
        res.status(200).json({ message: "Subscribed successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const unsubscribeController = async (req, res) => {
    const { channelId } = req.body;
    const userId = req.userId;

    try {
        await Subscription.findOneAndDelete({
            Subscriber: userId,
            Channel: channelId
        });
        res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const checkSubscriptionController = async (req, res) => {
    const { channelId } = req.params;
    const userId = req.userId;
    // console.log(userId,channelId)
    try {
        const subscription = await Subscription.findOne({
            Subscriber: userId,
            Channel: channelId
        });

        res.status(200).json({
            isSubscribed: !!subscription
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getMySubscriptionsController = async (req, res) => {
    const userId = req.userId;

    try {
        const subscriptions = await Subscription.find({ Subscriber: userId });
        res.status(200).json(subscriptions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getChannelSubscribersController = async (req, res) => {
    const { channelId } = req.params;

    try {
        const subscribers = await Subscription.find({ Channel: channelId });
        res.status(200).json(subscribers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
