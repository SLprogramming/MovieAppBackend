import mongoose from "mongoose";

const premiumPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a plan name"], // e.g., "Basic", "Standard", "VIP"
        trim: true
    },
    durationDays: {
        type: Number,
        required: [true, "Please provide plan duration in days"], // e.g., 30 for 1 month
    },
    price: {
        type: Number,
        required: [true, "Please provide the plan price"], // e.g., 9.99
    },
    currency:{
        type:String,
        default:"MMK"
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true // Can deactivate without deleting
    }
}, { timestamps: true });

const PremiumPlan = mongoose.model("PremiumPlan", premiumPlanSchema);
export default PremiumPlan;
