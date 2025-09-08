// import { redis } from "../config/redis.js";
import userModel from "../models/user.model.js";

// get user by id
export const getUserById = async (id,res) => {
    // const userJson = await redis.get(id)
    const userJson = await userModel.findById(id)
  
    res.status(201).json({
        success:true,
        user:userJson,
  
    })
    
}





