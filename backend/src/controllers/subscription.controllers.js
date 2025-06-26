import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import { Apierror } from "../utils/APIerror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId || !isValidObjectId(channelId)) {
        throw new Apierror(400, "Invalid channel ID");
    }

    const existingSub = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id,
    });

    if (existingSub) {
        await existingSub.deleteOne();
        return res.status(200).json(
            new Apiresponce(200, null, "Unsubscribed from channel")
        );
    }

    const newSub = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id,
    });

    res.status(201).json(
        new Apiresponce(201, newSub, "Subscribed to channel successfully")
    );
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!channelId || !isValidObjectId(channelId)) {
        throw new Apierror(400, "Invalid channel ID");
    }
    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username name profilePicture")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new Apiresponce(
            200,
            subscribers,
            subscribers.length === 0 ? "No subscribers found" : "Subscribers retrieved successfully"
        )
    );
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!subscriberId) {
        throw new Apierror(400, "Subscriber ID is required");
    }
    if (!subscriberId || !isValidObjectId(subscriberId)) {
        throw new Apierror(400, "Invalid subscriber ID");
    }
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username name profilePicture")
        .sort({ createdAt: -1 });
    res.status(200).json(
        new Apiresponce(
            200,
            subscriptions,
            subscriptions.length === 0
                ? "No subscribed channels found"
                : "Subscribed channels retrieved successfully"
        )
    );
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}