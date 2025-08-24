import mongoose from "mongoose";
import userModel from "./user.model.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import PremiumPlan from "./premiumPlan.model.js";

const purchaseRequestSchema = new mongoose.Schema({
     user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    plan_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PremiumPlan",
        require:[true,"select a plan"]
    },
   status: {
        type: String,
        enum: ["pending", "approved", "rejected"], // adjust values as needed
        default: "pending"
    },
    transitionNumber:{
        type:String,
        required:[true,"transition number is required"]
    },
     img: {
        url: { type: String, required: true },        // store Cloudinary URL
        public_id: { type: String, required: true }   // store Cloudinary public_id
    },
    bankAccount_id:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"BankAccount",
        require:[true,"select an account"]
    }
}, { timestamps: true });

purchaseRequestSchema.methods.changeStatus =async function(newStatus) {
    try {
         const validStatuses = ["pending", "approved", "rejected"]
         if (!validStatuses.includes(newStatus)) {
            throw (new ErrorHandler("Invalid status", 400));
        }
        let user = await userModel.findById(this.user_id)
        let plan = await PremiumPlan.findById(this.plan_id)
        if(!user) return next(new ErrorHandler("user not found",404))

        if(newStatus == 'approved'){         
            await user.activatePremium(plan.durationDays)         
        }

        this.status = newStatus
        let saveRequest = await this.save()
        await saveRequest.populate("user_id").populate("plan_id")
        return saveRequest
        
    } catch (error) {
        throw (new ErrorHandler(error.message, 400))
    }
}

const PurchaseRequest = mongoose.model("PurchaseRequest", purchaseRequestSchema);
export default PurchaseRequest;
