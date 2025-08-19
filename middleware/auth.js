import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";
import userModel from "../models/user.model.js";
// import { redis } from "../config/redis.js";

//authenticated user
dotEnv.config();
export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
  
    if (!access_token) {
      return next(
        new ErrorHandler("Please Login To Access This Resources", 401)
      );
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }
   

    // const user = await redis.get(decoded.id)
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("user not found", 400));
    }
    
    req.user = user;

    next();
  } catch (error) {
 
    return next(new ErrorHandler(error.message,error.message == "jwt expired"? 401 : 500))
  }
});

//validate user role
export const authorizeRoles = (...roles) => {
  
  return (req, res, next) => {
    console.log(req.user.role,roles)
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role:${req.user?.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};

// check premium
export const isPremiumActive = (req, res, next) => {
  if (!req.user?.isPremiumActive() && req.user.role == 'user') {
    return next(
      new ErrorHandler("Please extend premiun to access this resources", 403)
    );
  }
  next();
};
