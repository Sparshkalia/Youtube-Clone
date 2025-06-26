import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGEN,
    credentials: true
}))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRouter from './routes/user.routes.js'
import Videorouter from './routes/video.routes.js';
import Commentsrouter from './routes/comments.routes.js';
import Playlistrouter from './routes/playlist.routes.js';
import Likerouter from './routes/like.routes.js'
import Subscriptionrouter from './routes/subscription.routes.js';
import Dashboardrouter from './routes/dashboard.routes.js';
app.use("/api/v1/users", userRouter)
app.use('/api/v1/videos', Videorouter);
app.use('/api/v1/comments',Commentsrouter)
app.use('/api/v1/playlists',Playlistrouter)
app.use('/api/v1/likes',Likerouter)
app.use('/api/v1/subscription',Subscriptionrouter)
app.use('/api/v1/dashboard',Dashboardrouter)
export default app;