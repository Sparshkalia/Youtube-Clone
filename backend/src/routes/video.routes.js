import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    getGlobalVideofeed,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const Videorouter = Router();

// ✅ Public feed route (homepage)
Videorouter.route("/feed").get(getGlobalVideofeed);

// ✅ Protected routes
Videorouter.use(verifyJWT);

// GET all user videos / POST upload new
Videorouter.route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            { name: "Videofile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishAVideo
    );

// GET, PATCH (with optional thumbnail), DELETE a single video
Videorouter.route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

// Toggle publish status
Videorouter.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default Videorouter;
