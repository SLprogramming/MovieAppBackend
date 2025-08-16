import express from "express"
import {  createPremiumPlan, 
    getAllPremiumPlans, 
    getPremiumPlanById, 
    updatePremiumPlan, 
    deletePremiumPlan  } from "../controllers/premiumPlan.controller.js"

const planRouter = express.Router()

planRouter.get('/get-all',getAllPremiumPlans)
planRouter.get('/get/:id',getPremiumPlanById)
planRouter.post('/create',createPremiumPlan)
planRouter.put('/update/:id',updatePremiumPlan)
planRouter.delete('/delete/:id',deletePremiumPlan)

export default planRouter;