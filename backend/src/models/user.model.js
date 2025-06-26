import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const Userschema= new mongoose.Schema({
    username:{
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    avatar:{
        type:String,
        required: true
    },
    coverimage:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    watchhistory:[{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    refreshToken:{
        type:String,
    }
},{timestamps: true})
Userschema.pre("save", async function (next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})
Userschema.methods.passwordcorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}
Userschema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
Userschema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User= mongoose.model("User",Userschema)