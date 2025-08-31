// import { redis } from "../config/redis.js";
import { getUserMediaList } from "../controllers/movie.controller.js";
import userModel from "../models/user.model.js";

// get user by id
export const getUserById = async (id,res) => {
    // const userJson = await redis.get(id)
    const userJson = await userModel.findById(id)
    // console.log(userJson)
    // let favoritesMovies =await getUserMediaList(userJson.favoritesMovies,'movie')
    // let favoritesTV =await getUserMediaList(userJson.favoritesTV,'tv')
    // let bookmarksMovies =await getUserMediaList(userJson.bookmarksMovies,'movie')
    // let bookmarksTV =await getUserMediaList(userJson.bookmarksTV,'tv')
    // let recentMovies =await getUserMediaList(userJson.recentMovies,'movie')
    // let recentTV =await getUserMediaList(userJson.recentTV,'tv')
    // console.log(recentMovies)
        
    res.status(201).json({
        success:true,
        user:userJson,
  
    })
    
}





