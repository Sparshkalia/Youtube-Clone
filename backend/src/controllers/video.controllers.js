import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { Apierror } from "../utils/APIerror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const match = {};
    if (query) {
        match.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Apierror(400, "Invalid user ID");
        }
        match.owner = new mongoose.Types.ObjectId(userId);
    }
    const sort = {};
    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
        sort.createdAt = -1;
    }
    const videos = await Video.aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: skip },
        { $limit: Number(limit) },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                ownerDetails: {
                    _id: 1,
                    username: 1,
                    avatar: 1
                }
            }
        }
    ]);
    const totalVideos = await Video.countDocuments(match);

    res.status(200).json(
        new Apiresponce(200, videos, "Videos fetched successfully", {
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: Number(page)
        })
    );
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.files?.Videofile?.[0]?.path;
    const thumbnailFile = req.files?.thumbnail?.[0]?.path;
    if (!title || !description) {
        throw new Apierror(400, "Title and description are required");
    }

    if (!videoFile) {
        throw new Apierror(400, "Video file is missing");
    }
    if (!thumbnailFile) {
        throw new Apierror(400, "Thumbnail file is missing");
    }
    const uploadedVideo = await uploadOnCloudinary(videoFile, "video");
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile, "image");
    if (!uploadedThumbnail?.url) {
        throw new Apierror(500, "Failed to upload thumbnail to Cloudinary");
    }
    if (!uploadedVideo?.url) {
        throw new Apierror(500, "Failed to upload video to Cloudinary");
    }
    const newVideo = await Video.create({
        title,
        description,
        Videofile: uploadedVideo.url,
        duration: uploadedVideo.duration || 0,
        owner: req.user._id,
        isPublished: true,
        thumbnail: uploadedThumbnail.url
    });

    return res.status(201).json(
        new Apiresponce(201, newVideo, "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video ID");
    }
    const video=await Video.findById(videoId)
    if (!video) {
        throw new Apierror(404, "Video not found");
    }

    return res.status(200).json(
        new Apiresponce(200, video, "Video fetched successfully")
    );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body || {};
    const thumbnailFile = req.file; 
    if (!videoId) {
        throw new Apierror(400, "Invalid video id");
    }
    if (!title && !description && !thumbnailFile) {
        throw new Apierror(400, "At least one field (title, description, or thumbnail) must be provided");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new Apierror(404, "Video not found");
    }
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (thumbnailFile) {
        const uploaded = await uploadOnCloudinary(thumbnailFile.path, "image");
        if (!uploaded || !uploaded.url) {
            throw new Apierror(400, "Failed to upload thumbnail to Cloudinary");
        }
        const oldThumbnailPublicId = getCloudinaryPublicId(video.thumbnail);
        if (oldThumbnailPublicId) {
            const deleted = await deleteFromCloudinary(oldThumbnailPublicId, "image");
            if (deleted?.result !== "ok" && deleted?.result !== "not found") {
                throw new Apierror(500, "Failed to delete old thumbnail from Cloudinary");
            }
        }
        updatedFields.thumbnail = uploaded.url;
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updatedFields },
        { new: true }
    );
    if (!updatedVideo) {
        throw new Apierror(400, "Failed to update video details");
    }
    res.status(200).json(new Apiresponce(200, updatedVideo, "Video details updated successfully"));
});


const getCloudinaryPublicId = (url) => {
    try {
        if (!url) return null;
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/'); 
        const fileNameWithExt = parts.pop();               
        const fileName = fileNameWithExt.split('.')[0];    
        return fileName;
    } catch (err) {
        console.error("Error extracting Cloudinary public ID:", err);
        return null;
    }
};


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new Apierror(400, "Invalid video id");
    }
    const video = await Video.findByIdAndDelete(videoId);
    if (!video) {
        throw new Apierror(404, "Video not found");
    }
    const user = await User.findById(req.user._id);
    if (user?.videos?.length) {
        user.videos = user.videos.filter(v => !v.equals(video._id));
        await user.save();
    }
    const videoPublicId = video.Videofile ? getCloudinaryPublicId(video.Videofile) : null;
    const thumbPublicId = video.thumbnail ? getCloudinaryPublicId(video.thumbnail) : null;
    if (videoPublicId) {
        const videoDel = await deleteFromCloudinary(videoPublicId, "video");
        if (videoDel?.result !== "ok" && videoDel?.result !== "not found") {
        throw new Apierror(500, "Failed to delete video from Cloudinary");
        }
    }
    if (thumbPublicId) {
        const thumbDel = await deleteFromCloudinary(thumbPublicId, "image");
        if (thumbDel?.result !== "ok" && thumbDel?.result !== "not found") {
        throw new Apierror(500, "Failed to delete thumbnail from Cloudinary");
        }
    }
    return res.status(200).json(
        new Apiresponce(200, video, "Video deleted successfully")
    );
    });

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new Apierror(400, "Invalid video id");
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        [{ $set: { isPublished: { $not: "$isPublished" } } }],
        { new: true }
    );
    if (!video) {
        throw new Apierror(400, "Failed to update publish status");
    }
    res.status(200).json(new Apiresponce(200, video, "Publish status updated successfully"));
});

const getGlobalVideofeed= asyncHandler(async(req,res)=>{
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const sort = {};
    sort[sortBy] = sortType === "desc" ? -1 : 1;

    const videos = await Video.aggregate([
        { $match: { isPublished: true } },
        { $sort: sort },
        { $skip: skip },
        { $limit: Number(limit) },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                ownerDetails: {
                    _id: 1,
                    username: 1,
                    avatar: 1
                }
            }
        }
    ]);

    const totalVideos = await Video.countDocuments({ isPublished: true });

    res.status(200).json(
        new Apiresponce(200, videos, "Global video feed fetched successfully", {
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: Number(page)
        })
    );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getGlobalVideofeed
}