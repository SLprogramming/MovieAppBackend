import express from "express"
import { activatePremium, activateUser, addToList, getPremiumUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updatePassword, updateUser } from "../controllers/user.controller.js"
import {  authorizeRoles, isAuthenticated } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post('/auth/register',registrationUser)

userRouter.post('/auth/activate-user',activateUser)

userRouter.post('/auth/login',loginUser)

userRouter.post('/auth/social-auth',socialAuth)

userRouter.get('/auth/refreshtoken',updateAccessToken)

userRouter.get('/auth/logout',isAuthenticated,logoutUser)

userRouter.get('/auth/info',isAuthenticated,getUserInfo)

userRouter.put('/auth/update-info',isAuthenticated,updateUser)

userRouter.put('/auth/update-password',isAuthenticated,updatePassword)

userRouter.put('/auth/extend-premium',activatePremium)

userRouter.put('/user/add-bookmarks-favorate',addToList)

userRouter.get('/user/get-premium-user',isAuthenticated,authorizeRoles(['superAdmin','admin']),getPremiumUser)

export default userRouter