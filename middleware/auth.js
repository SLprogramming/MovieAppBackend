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
    const refresh_token = req.cookies.refresh_token;

    if (!access_token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    // Verify access token
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    // Get user from DB
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // 🔥 Ensure the session is still valid
    const sessionValid = user.sessions.some(
      (s) => s.token === refresh_token // or compare against refresh_token if you use that for session tracking
    );

    if (!sessionValid) {
      return next(new ErrorHandler("Session expired or blocked", 409));
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return next(
      new ErrorHandler(
        error.message,
        error.message === "jwt expired" ? 401 : 500
      )
    );
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
