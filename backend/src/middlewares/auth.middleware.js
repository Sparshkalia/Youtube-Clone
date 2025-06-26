import { Apierror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config(); 
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accesstoken;

  console.log("Cookie access token:", token);

  if (!token) {
    throw new Apierror(401, "Unauthorized access: Token missing or invalid");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if (!user) {
      throw new Apierror(401, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    throw new Apierror(401, "Invalid access token");
  }
});


