import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";
const connectdb=async()=>{
    try {
        const connect= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongo database connected${connect.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}
export default connectdb