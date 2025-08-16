import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a account name"], 
        trim: true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    accNumber:{
        type:String,
        require:[true,"acc number is required"],
        trim:true
    },
    paymentType_id:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentType",
        require:[true,"payment type is required"]
    }
}, { timestamps: true });

bankAccountSchema.methods.activeToggle = async function (flag = true) {
    this.isActive = flag
    return this.save()
}

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);
export default BankAccount;
