import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/APIerror.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Apiresponce } from "../utils/Apiresponce.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
dotenv.config()
const generateAccessAndRefreshToken=async(userid)=>{
    try {
        const user=await User.findById(userid)
        const accesstoken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accesstoken,refreshToken}
    } catch (error) {
        throw new Apierror(500,"Something went wrong in Access or Refresh token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullname, email, username, password } = req.body;
    if ([fullname, email, username, password].some(field => !field?.trim())) {
        throw new Apierror(400, "All fields are required");
    }
    const exist = await User.findOne({ $or: [{ username }, { email }] });
    if (exist) {
        throw new Apierror(409, "User already exists");
    }

    const avatarLocalPath = req?.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if(req.files&&Array.isArray(req.files.coverimage)&&req.files.coverimage.length>0){
        coverImageLocalPath=req.files.coverimage[0].path;
    }

    if (!avatarLocalPath) {
        throw new Apierror(400, "Avatar image is required");
    }
    const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUploadResult?.url) {
        throw new Apierror(500, "Failed to upload avatar to Cloudinary");
    }

    let coverImageUploadResult = null;
    if (coverImageLocalPath) {
        coverImageUploadResult = await uploadOnCloudinary(coverImageLocalPath);
    }
    console.log(avatarUploadResult)
    const user = await User.create({
        fullname,
        avatar: avatarUploadResult.url,
        coverimage: coverImageUploadResult?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new Apierror(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new Apiresponce(201, createdUser, "User created successfully")
    );
});
const loginUser = asyncHandler(async (req, res) => {
     //req.body- extract data
    //usename or email-input
    //search for username or email
    //check for password
    //generate access and refresh token
    //send cookie
    //send response
    const { username, email, password } = req.body;
    if (!(username || email)) {
        throw new Apierror(400, "email or username is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (!user) {
        throw new Apierror(404, "User does not exist");
    }
    const isPasswordCorrect = await user.passwordcorrect(password);
    if (!isPasswordCorrect) {
        throw new Apierror(401, "Your password is not correct");
    }
    const { accesstoken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const logdinuser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    };
    res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponce(
                200,
                {
                    user: logdinuser,
                    refreshToken,
                    accesstoken
                },
                "User login successfully"
            )
        );
});
const logoutuser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken: undefined
        }
    },  
        {
            new: true
        })
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accesstoken",options).clearCookie("refreshToken",options).json(new Apiresponce(200,"User loggedout sucessfully"))
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incommingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
    if(!incommingRefreshToken){
        throw new Apierror(401,"Unautherized request")
    }
    try {
        const decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new Apierror(401,"Invalid refresh token")
        }
        if(incommingRefreshToken!=user?.refreshToken){
            throw new Apierror(401,"refresh token expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {newaccesstoken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
        return res.status(200).cookie("AccessToken",newaccesstoken,options).cookie("refreshToken",newrefreshToken,options).json(new Apiresponce(200,{newaccesstoken,newrefreshToken},"AccessToken Refreshed"))
    } catch (error) {
        throw new Apierror(400,error?.message||"invalid refresh token")
    }
})
const changePassword=asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword}=req.body
    const user=User.findById(req.user?._id)
    const ispasswordcorrect=await user.passwordcorrect(oldpassword)
    if(!ispasswordcorrect){
        throw new Apierror(400,"Invalid old password")
    }
    user.password=newpassword
    await user.save({validateBeforeSave:false})
    return res.status(200).json(200,{},"password changed successfully")
})
const getUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new Apiresponce(200,req.user,"user details fetched successfully"))
})
const updateDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body
    if(!(fullname||email)){
        throw new Apierror(400,"fullname or email not found")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{$set:{fullname,email}},{new:true}).select("-password")
    return res.send(200).json(new Apiresponce(200,user,"user details updated successfully"))
})
const UpdateAvatar = asyncHandler(async (req, res) => {
    const newAvatar = req.file?.path;

    if (!newAvatar) {
        throw new Apierror(400, "Avatar is not found");
    }

    const avatar = await uploadOnCloudinary(newAvatar);
    const oldUrl = req.user?.avatar;

    if (!avatar?.url) {
        throw new Apierror(400, "Failed to upload on Cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password");

    if (oldUrl) {
        const oldPublicId = oldUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(oldPublicId); 
    }

    return res.status(200).json(
        new Apiresponce(200, user, "Avatar updated successfully")
    );
})
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new Apierror(400, "Username param is required");
    }

    const currentUserId = req.user?._id;

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribed"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedCount: { $size: "$subscribed" },
                isSubscribed: {
                    $cond: {
                        if: {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$subscribers",
                                            as: "sub",
                                            cond: { $eq: ["$$sub.subscriber", currentUserId] }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                _id: 1, // ✅ Include channel ID
                fullname: 1,
                username: 1,
                avatar: 1,
                coverimage: 1,
                email: 1,
                subscribersCount: 1,
                channelsSubscribedCount: 1,
                isSubscribed: 1
            }
        }
    ]);

    if (!channel || channel.length === 0) {
        throw new Apierror(404, "Channel does not exist");
    }

    return res.status(200).json(
        new Apiresponce(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchhistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },{
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new Apiresponce(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})
export {registerUser,loginUser,logoutuser,refreshAccessToken,changePassword,getUser,updateDetails,UpdateAvatar,getUserChannelProfile,getWatchhistory}