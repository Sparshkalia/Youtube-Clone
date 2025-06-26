import {Comment} from "../models/comment.model.js"
import { Apierror } from "../utils/APIerror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!videoId) {
        throw new Apierror(400, "Video ID is required");
    }
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username avatar") 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    res.status(200).json(
        new Apiresponce(200, comments, "Comments fetched successfully")
    );
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} =req.params
    console.log("req.body =>", req.body);

    const {content} = req.body
    if (!content || content.trim() === "") {
        throw new Apierror(400, "Comment content cannot be empty")
    }
    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id
    })
    if (!comment) {
        throw new Apierror(500, "Failed to add comment")
    }
    res.status(201).json(new Apiresponce(201, true, "Comment added successfully", comment))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body || {};
    if (!commentId) {
        throw new Apierror(400, "Comment ID is required");
    }
    if (!content || content.trim() === "") {
        throw new Apierror(400, "Updated comment cannot be empty");
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content: content.trim() } },
        { new: true }
    );
    if (!comment) {
        throw new Apierror(404, "Comment not found");
    }
    return res
        .status(200)
        .json(new Apiresponce(200, comment, "Comment updated successfully"));
});


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    if(!commentId){
        throw new Apierror(400,"Comment Id is required")
    }
    const comment=await Comment.findByIdAndDelete(commentId)
     if (!comment) {
        throw new Apierror(404, "Comment not found or already deleted");
    }
    return res.status(200).json(new Apiresponce(200,comment,"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }