import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const Likerouter = Router();
Likerouter.use(verifyJWT); 
Likerouter.route("/toggle/v/:videoId").post(toggleVideoLike);
Likerouter.route("/toggle/c/:commentId").post(toggleCommentLike);
Likerouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
Likerouter.route("/videos").get(getLikedVideos);

export default Likerouter