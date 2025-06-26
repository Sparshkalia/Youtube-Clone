import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Apierror } from "../utils/APIerror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: req.user._id });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new Apiresponce(200, null, "Video unliked"));
    }

    const like = await Like.create({ video: videoId, likedBy: req.user._id });
    return res.status(201).json(new Apiresponce(201, like, "Video liked"));
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId || !isValidObjectId(commentId)) {
        throw new Apierror(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({ comments: commentId, likedBy: req.user._id });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new Apiresponce(200, null, "Comment unliked"));
    }

    const like = await Like.create({ comments: commentId, likedBy: req.user._id });
    return res.status(201).json(new Apiresponce(201, like, "Comment liked"));
});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new Apierror(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json(new Apiresponce(200, null, "Tweet unliked"));
    }

    const like = await Like.create({ tweet: tweetId, likedBy: req.user._id });
    return res.status(201).json(new Apiresponce(201, like, "Tweet liked"));
});
const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({ 
        likedBy: req.user._id, 
        video: { $exists: true, $ne: null } 
    }).populate('video', 'title thumbnailUrl');

    const likedVideos = likes
        .map((like) => like.video)
        .filter((video) => video !== null); 

    if (likedVideos.length === 0) {
        return res.status(404).json(new Apiresponce(404, null, "No liked videos found"));
    }

    return res.status(200).json(
        new Apiresponce(200, likedVideos, "Liked videos retrieved successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}