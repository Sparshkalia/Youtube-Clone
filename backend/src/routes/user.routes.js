import { Router } from "express";
import { loginUser, logoutuser, refreshAccessToken, registerUser,changePassword,getUser,updateDetails,UpdateAvatar,getUserChannelProfile,getWatchhistory } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const Userrouter=Router()
Userrouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ])
    ,registerUser)

Userrouter.route("/login").post(loginUser)
Userrouter.route("/logout").post(verifyJWT,logoutuser)
Userrouter.route("/refreshToken").post(refreshAccessToken)
Userrouter.route("/change-password").post(verifyJWT, changePassword)
Userrouter.route("/current-user").get(verifyJWT, getUser)
Userrouter.route("/update-account").patch(verifyJWT, updateDetails)
Userrouter.route("/avatar").patch(verifyJWT, upload.single("avatar"), UpdateAvatar)
Userrouter.route("/c/:username").get(verifyJWT, getUserChannelProfile)
Userrouter.route("/history").get(verifyJWT, getWatchhistory)

export default Userrouter;