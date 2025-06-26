import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import { Apierror } from "../utils/APIerror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    console.log("req.body",req.body)
    if (!name || !description) {
        throw new Apierror(400, "Name and description are required");
    }
    if (name.trim() === "" || description.trim() === "") {
        throw new Apierror(400, "Name and description cannot be empty");
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        owner: req.user._id
    });

    if (!playlist) {
        throw new Apierror(500, "Failed to create playlist");
    }

    res.status(201).json(new Apiresponce(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new Apierror(400, "Invalid user ID");
    }
    const playlists = await Playlist.find({ owner: userId }).populate('videos', 'title thumbnailUrl');
    if (!playlists || playlists.length === 0) {
        throw new Apierror(404, "No playlists found for this user");
    }
    res.status(200).json(new Apiresponce(200, playlists, "User playlists retrieved successfully"));
});


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new Apierror(400,"Playlist id not found")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new Apierror(400,"Playlist Doesnt exist")
    }
    res.status(200).json(new Apiresponce(200,playlist,"Playlist Fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId) {
        throw new Apierror(400, "Playlist ID is required");
    }
    if (!videoId) {
        throw new Apierror(400, "Video ID is required");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new Apierror(404, "Video not found");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Apierror(404, "Playlist not found");
    }
    if (playlist.videos.includes(video._id)) {
        throw new Apierror(400, "Video already exists in the playlist");
    }
    playlist.videos.push(video._id);
    await playlist.save();
    res.status(200).json(
        new Apiresponce(200, playlist, "Video added to playlist successfully")
    );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId || !videoId) {
        throw new Apierror(400, "Both playlistId and videoId are required");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Apierror(404, "Playlist not found");
    }
    const index = playlist.videos.findIndex(
        (vid) => vid.toString() === videoId
    );
    if (index === -1) {
        throw new Apierror(404, "Video not found in playlist");
    }
    playlist.videos.splice(index, 1);
    await playlist.save();
    res.status(200).json(
        new Apiresponce(200, playlist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new Apierror(400,"Playlist id not found")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new Apierror(404, "Playlist not found");
    }   
    res.status(200).json(new Apiresponce(200, { id: playlist._id }, "Playlist deleted successfully"));
;
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body || {};
    if (!playlistId) {
        throw new Apierror(400, "Playlist ID is required");
    }
    if (!name && !description) {
        throw new Apierror(400, "At least one field (name or description) is required for update");
    }
    const updatedFields = {};
    if (name && name.trim() !== "") updatedFields.name = name.trim();
    if (description && description.trim() !== "") updatedFields.description = description.trim();

    if (Object.keys(updatedFields).length === 0) {
        throw new Apierror(400, "Provided fields cannot be empty");
    }
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set: updatedFields },
        { new: true }
    );
    if (!playlist) {
        throw new Apierror(404, "Playlist not found");
    }
    res.status(200).json(
        new Apiresponce(200, playlist, "Playlist updated successfully")
    );
});


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}