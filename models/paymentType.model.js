import mongoose from "mongoose";

const paymentTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a payment name"], 
        trim: true
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, { timestamps: true });

paymentTypeSchema.methods.activeToggle = async function (flag = true) {
    this.isActive = flag
    return this.save()
}

const PaymentType = mongoose.model("PaymentType", paymentTypeSchema);
export default PaymentType;
