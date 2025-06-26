import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const Playlistrouter = Router();
Playlistrouter.use(verifyJWT); 
Playlistrouter.route("/").post(createPlaylist)
Playlistrouter
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);
Playlistrouter.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
Playlistrouter.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);
Playlistrouter.route("/user/:userId").get(getUserPlaylists);
export default Playlistrouter