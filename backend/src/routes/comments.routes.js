import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comments.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const Commentsrouter = Router();

Commentsrouter.use(verifyJWT);

Commentsrouter.route("/:videoId").get(getVideoComments).post(addComment);
Commentsrouter.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default Commentsrouter