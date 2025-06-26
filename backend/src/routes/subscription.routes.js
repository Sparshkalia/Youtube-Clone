import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const Subscriptionrouter = Router();
Subscriptionrouter.use(verifyJWT); 
Subscriptionrouter
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

Subscriptionrouter.route("/u/:subscriberId").get(getSubscribedChannels);

export default Subscriptionrouter