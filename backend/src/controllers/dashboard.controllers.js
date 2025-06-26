import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { Apierror } from "../utils/APIerror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Apierror("Invalid channel ID", 400);
    }

    const channelVideos = await Video.find({ channel: channelId }).select('views _id').lean();

    const videoIds = channelVideos.map(video => video._id);
    const totalViews = channelVideos.reduce((acc, video) => acc + (video.views || 0), 0);

    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    const totalVideos = channelVideos.length;

    res.status(200).json(
        new Apiresponce(200, {
            totalViews,
            totalLikes,
            totalVideos,
            totalSubscribers
        }, "Channel stats retrieved successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new Apierror("Invalid channel ID", 400);
    }

    const videos = await Video.find({ channel: channelId })
        .sort({ createdAt: -1 })
        .populate("channel", "username name avatar")
        .lean();

    res.status(200).json(
        new Apiresponce(
            200,
            videos,
            videos.length === 0
                ? "No videos found for this channel"
                : "Channel videos retrieved successfully"
        )
    );
});
const getGlobalVideoFeed = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12, sortBy = "createdAt", order = "desc" } = req.query;

    const sortOption = { [sortBy]: order === "asc" ? 1 : -1 };

    const videos = await Video.find({ isPublished: true }) // Only published videos
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("channel", "username name avatar") // Enrich with channel info
        .lean();

    const total = await Video.countDocuments({ isPublished: true });

    res.status(200).json(
        new Apiresponce(200, {
            videos,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            totalVideos: total,
        }, "Global video feed fetched successfully")
    );
});



export {
    getChannelStats, 
    getChannelVideos,
    getGlobalVideoFeed
    }