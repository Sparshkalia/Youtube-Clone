import mongoose from "mongoose";
const TweetSchema=new mongoose.Schema({
    content:{
        type:"string",
        required:true
    },
    owner:{
        type:Schema.Type.ObjectId,
        ref:"User"
    }
})
export const Tweet=mongoose.model("Tweet",TweetSchema)