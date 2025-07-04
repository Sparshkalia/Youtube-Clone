import mongoose,{Schema} from "mongoose";
const likeSchema=new mongoose.Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    comments:{
        type:Schema.Types.ObjectId,
        ref:"Comments"
    },
     tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

export const Like = mongoose.model("Like", likeSchema)