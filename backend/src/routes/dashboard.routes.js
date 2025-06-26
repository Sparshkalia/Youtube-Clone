import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
    getGlobalVideoFeed,
} from "../controllers/dashboard.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const Dashboardrouter = Router();

Dashboardrouter.use(verifyJWT); 

Dashboardrouter.route("/stats").get(getChannelStats);
Dashboardrouter.route("/videos").get(getChannelVideos);
Dashboardrouter.route('/main').get(getGlobalVideoFeed);
export default Dashboardrouter;