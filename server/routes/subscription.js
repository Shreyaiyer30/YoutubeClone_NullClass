import express from "express";
import {
    subscribeController,
    unsubscribeController,
    checkSubscriptionController,
    getMySubscriptionsController,
    getChannelSubscribersController
} from "../controllers/subscription.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/subscribe', verifyToken, subscribeController);
router.post('/unsubscribe', verifyToken, unsubscribeController);
router.get('/check/:channelId', verifyToken, checkSubscriptionController);
router.get('/my-subscriptions', verifyToken, getMySubscriptionsController);
router.get('/channel-subscribers/:channelId', getChannelSubscribersController);

export default router;
