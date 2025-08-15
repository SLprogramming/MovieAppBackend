import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotEnv from "dotenv"
import jwt from "jsonwebtoken"
dotEnv.config()

const emailRegexPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: function (value) {
        return emailRegexPattern.test(value);
      },
      message:"Please enter a valid email",
    },
    unique:true,
  },
   premiumExpire: {
    type: Number,
    default: null, // null means not premium
  },
  password: {
    type: String,
    // required:[true,'Please enter your password'],
    minlength:[6,'Password must be at least 6 characters'],
    select:false,
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    default: "user"  // ['superAdmin','admin','user']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  bookmarksMovies: {
    type: [String], 
    default: [],
  },
  favoritesMovies: {
    type: [String],
    default: [],
  },
  bookmarksTV: {
    type: [String], 
    default: [],
  },
  favoritesTV: {
    type: [String],
    default: [],
  }

},{timestamps:true});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

// Adding a method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//sign access token
userSchema.methods.SignAccessToken =  function () {
    return jwt.sign({id:this.id},process.env.ACCESS_TOKEN || "",{
        expiresIn:"5m"
    })
}

//sign refresh token
userSchema.methods.SignRefreshToken =  function () {
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN || "",{
        expiresIn:"3d"
    })
}

//check premium
userSchema.methods.isPremiumActive = function() {
  if (!this.premiumExpire) return false; // no premium
  return Date.now() < this.premiumExpire;
}

const userModel = mongoose.model("User", userSchema);
export default userModel
