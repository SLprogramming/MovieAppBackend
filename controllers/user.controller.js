import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import dotEnv from "dotenv";
import path from "path";
import sendMail from "../utils/sendMail.js";
import {__dirname,__filename} from "../config/filePath.js"
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt.js";
import commonPasswords from "../staticData/commonPassword.js" 
// import { redis } from "../config/redis.js";
import { decode } from "punycode";
import { getUserById } from "../services/user.service.js";
import { getUserMediaList } from "./movie.controller.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

dotEnv.config();

//register user
export const registrationUser = CatchAsyncError(async (req, res, next) => {

  try {
    const { name, email, password } = req.body;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email is already exist", 400));
    }

    const user = { name, email, password };


    if (commonPasswords.common_passwords.includes(password)) {
        return next(new ErrorHandler("Password is too common", 400));
      }
  
    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;
    console.log(activationCode)

    const data = { user: { name: user.name }, activationCode };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );
    let expireDate = Date.now() + (5 * 60 * 1000)

    try {
      await sendMail({
        // email: user.email,
        email:'joesat2516@gmail.com',
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
        activationToken: activationToken.token,
        expireIn:expireDate,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


//create activation token
export const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 900000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};


//activate user
export const activateUser = CatchAsyncError(async (req,res,next) => {
    try {
        const {activation_token,activation_code} = req.body

        const newUser  = jwt.verify(activation_token,process.env.ACTIVATION_SECRET)

        if(newUser.activationCode !== activation_code){
            return next(new ErrorHandler("Invalid activation code!"))
        }

        const {name,email,password} = newUser.user
        const existUser = await userModel.findOne({email})

        if(existUser){
            return next(new ErrorHandler('Email already exist',400))
        }

        const user = await userModel.create({
            name,
            email,
            password
        })
        res.status(201).json({
            success:true,
            user

        })
        
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


//login user
export const loginUser = CatchAsyncError(async (req,res,next) => {
    try {
        const {email,password} = req.body
        if(!email || !password) {
            return next(new ErrorHandler("Please enter email and password",400))
        }
        const user = await userModel.findOne({email}).select("+password")

        if(!user) {
            return next(new ErrorHandler("Invalid email or password"))
        }

        const isPasswordMatch = await user.comparePassword(password)

        if(!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password"))
        }

        sendToken(user,200,res)
        
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


//logout user
export const logoutUser = CatchAsyncError(async (req,res,next) => {
    try {
        res.cookie("access_token","",{maxAge:1})
        res.cookie("refresh_token","",{maxAge:1})
        // redis.del(req.user._id || "")
        res.status(200).json({
            success:true,
            message:"Logged out successfully!"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


//update access token
export const updateAccessToken = CatchAsyncError(async (req,res,next) =>{
    try {
        const refresh_token = req.cookies.refresh_token
        const decoded = jwt.verify(refresh_token,process.env.REFRESH_TOKEN)

        const message = `Could not refresh token`
        if(!decode) {
            return next(new ErrorHandler(message,400))
        }

        // const session = await redis.get(decoded.id)
        const session = await userModel.findById(decoded.id)

        if(!session) {
            return next(new ErrorHandler(message,400)) 
        }
      
        const user =  session

        const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN,{
            expiresIn:"5m"
        })

        const refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN,{
            expiresIn:"3d"
        })

        req.user = user

        res.cookie("access_token",accessToken,accessTokenOptions)
        res.cookie("refresh_token",refreshToken,refreshTokenOptions)

        res.status(200).json({
            status:'success',
            accessToken
        })

    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


///get user info
export const getUserInfo = CatchAsyncError(async (req,res,next) => {
    try {
        // console.log(req.params.id)
        const userId = req.user?._id
        getUserById(userId,res)
        
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


//social authh
export const socialAuth = CatchAsyncError(async (req,res,next) => {
    try {
        const {email,name,avatar} = req.body
        const user = await userModel.findOne({email})  
        if(!user){
            const newUser = await userModel.create({email,name,avatar})
            sendToken(newUser,200,res)
        }else{
            sendToken(user,200,res)
        }
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


//update user info
export const updateUser = CatchAsyncError(async (req,res,next) => {
    try {
        const {name,email} = req.body
        const userId = req.user?._id

        const user = await userModel.findById(userId)

        if(email && user){
            const isEmailExist = await userModel.findOne({email})
            if(isEmailExist){
                return next(new ErrorHandler('Email already exist',400))
            }
            user.email = email
        }

        if(name && user){
            user.name = name
        }

      await  user?.save()
    //   await redis.set(userId,JSON.stringify(user))

      res.status(200).json({
        success:true,
        user,
      })
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})


//update user password
export const updatePassword = CatchAsyncError(async (req,res,next) => {
    try {
        const {oldPassword,newPassword} = req.body

        if(!oldPassword || !newPassword){
            return next(new ErrorHandler('Please enter old and new password',400))
        }

        const userId = req.user?._id

        const user = await userModel.findById(userId).select("+password")
        console.log(user)
        if(user?.password === undefined){
            return next(new ErrorHandler('Invalid user',400))
        }

        const isPasswordMatch = await user?.comparePassword(oldPassword)
       
        if(!isPasswordMatch){
            return next(new ErrorHandler('Invalid old password!',400))
        }

        user.password = newPassword

        await user.save()
        // await redis.set(userId,JSON.stringify(user))

       return res.status(200).json({
            success:true,
            user,
        })
        
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})

export const promoteAdmin = CatchAsyncError(async(req,res,next) => {
   try {
            const {id} = req.params
            const {role = 'user'} = req.body
            const user = await userModel.findById(id)
            if(!user){
                return next(new ErrorHandler("user not found!",404))
            }
            
            user.role = role
            await user.save()
           return res.status(200).json({
            success:true,
            user,
        })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400))
        }
})

export const activatePremium = CatchAsyncError(async (req,res,next) => {
    try {
        const {id,days} = req.body
        const user = await userModel.findById(id)
        if(!user){
            return next(new ErrorHandler("user not found!",404))
        }
       
        let updatedUser = await user.activatePremium(days)
        return res.status(200).json({success:true,message:'successfully subscribe',data:updatedUser})

    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
})

// to add bookmarks and favorite 
export const addToList = CatchAsyncError(async (req, res, next) => {
  try {
    const { type, flag, id } = req.body; 
    // type: "favorite" | "bookmark" | "recent"
    // flag: "movie" | "tv"

    const userId = req.user?._id;
    if (!id) return next(new ErrorHandler("Movie or series ID is required!", 400));
    if (!["favorite", "bookmark", "recent"].includes(type)) return next(new ErrorHandler("Invalid type!", 400));
    if (!["movie", "tv"].includes(flag)) return next(new ErrorHandler("Invalid flag!", 400));

    const user = await userModel.findById(userId);
    if (!user) return next(new ErrorHandler("User not found!", 404));

    const arrayKey = type; // matches schema key
    const existingIndex = user[arrayKey].findIndex(item => item.id === Number(id) && item.type === flag);

    // --- Recents (special handling: reorder & limit) ---
    if (type === "recent") {
      if (existingIndex !== -1) {
        // remove if already exists
        user[arrayKey].splice(existingIndex, 1);
      }

      // add new entry at the end
      user[arrayKey].push({ type: flag, id: Number(id) });

      // limit last 20
      if (user[arrayKey].length > 20) {
        user[arrayKey] = user[arrayKey].slice(-20);
      }
    } else {
      // --- Favorites / Bookmarks ---
      if (existingIndex !== -1) {
        return next(new ErrorHandler(`This ${flag} is already in ${type}`, 400));
      }

      user[arrayKey].push({ type: flag, id: Number(id) });
    }

    // fetch TMDB data for response
    const mediaData = await fetchFromTMDB(
      `https://api.themoviedb.org/3/${flag}/${id}?language=en-US`
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Successfully added into ${type}`,
      data: mediaData,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// to remove bookmarks and favorite
export const removeFromList = CatchAsyncError(async (req, res, next) => {
  try {
    const { type, flag, id } = req.body; 
    // type: "favorite" | "bookmark"
    // flag: "movie" | "tv"

    const userId = req.user?._id;
    if (!id) return next(new ErrorHandler("Movie or series ID is required!", 400));
    if (!["favorite", "bookmark","recent"].includes(type)) return next(new ErrorHandler("Invalid type!", 400));
    if (!["movie", "tv"].includes(flag)) return next(new ErrorHandler("Invalid flag!", 400));

    const user = await userModel.findById(userId);
    if (!user) return next(new ErrorHandler("User not found!", 404));

    const arrayKey = type; // matches schema field

    // find item
    const existingIndex = user[arrayKey].findIndex(
      item => item.id === Number(id) && item.type === flag
    );

    if (existingIndex === -1) {
      return next(new ErrorHandler(`This ${flag} is not in your ${type}`, 400));
    }

    // remove it
    user[arrayKey].splice(existingIndex, 1);

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Successfully removed from ${type}`,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});



export const getPremiumUser = CatchAsyncError(async (req, res, next) => {
    try {
        const activePremiumUsers = await userModel.find({ premiumExpire: { $gt: new Date() } });
        return res.status(200).json({success:true,count:activePremiumUsers.length,data:activePremiumUsers})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  try {
    // Get page & limit from query, fallback to defaults
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { 
  _id: { $ne: req.user._id }, 
  role: { $ne: "superAdmin" } 
};
    // Fetch users with pagination
    const users = await userModel.find(filter).skip(skip).limit(limit)

    // Count total documents
    const totalUsers = await userModel.countDocuments(filter)

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        pageSize: limit,
      },
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 400))
  }
})
