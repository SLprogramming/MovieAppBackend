import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotEnv from "dotenv"
import jwt from "jsonwebtoken"

import { v4 as uuidv4 } from "uuid";
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
  type: Date,
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
  bookmark: {
    type: [
      {
        type: {
          type: String,
          enum: ["movie", "tv"],
          required: true,
        },
        id: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
  favorite: {
     type: [
      {
        type: {
          type: String,
          enum: ["movie", "tv"],
          required: true,
        },
        id: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },

  recent: {
 type: [
      {
        type: {
          type: String,
          enum: ["movie", "tv"],
          required: true,
        },
        id: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
   sessions: [
    {
      device: { type: String },   // e.g. "Chrome on Windows"
      token: { type: String },    // refresh token
      createdAt: { type: Date, default: Date.now }
    }
  ],


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

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      jti: uuidv4(), // unique for each token
    },
    process.env.ACCESS_TOKEN || "",
    { expiresIn: "5m" }
  );
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      jti: uuidv4(), // unique per session
    },
    process.env.REFRESH_TOKEN || "",
    { expiresIn: "3d" }
  );
};
//check premium
userSchema.methods.isPremiumActive = function() {
  if (!this.premiumExpire) return false;
  return Date.now() < this.premiumExpire.getTime();
}

//activate premium
userSchema.methods.activatePremium = async function(days) {
  const msToAdd = days * 24 * 60 * 60 * 1000;

  if (this.isPremiumActive()) {
    // extend current premium
    this.premiumExpire = new Date(this.premiumExpire.getTime() + msToAdd);
  } else {
    // start premium from now
    this.premiumExpire = new Date(Date.now() + msToAdd);
  }

  return this.save();
}
userSchema.methods.addSession = async function(token, device = "Unknown") {
  const MAX_SESSIONS = 2;

  // 1️⃣ Remove expired sessions first
  this.sessions = this.sessions.filter(session => {
    try {
      const decoded = jwt.verify(session.token, process.env.REFRESH_TOKEN || "");
      return true; // still valid
    } catch (err) {
      // token expired or invalid
      return false; // remove it
    }
  });

  // 2️⃣ Check if we still exceed max sessions
  if (this.sessions.length >= MAX_SESSIONS) {
    return false; // block new login
  }

  // 3️⃣ Add new session
  this.sessions.push({ device, token });
  await this.save();

  return true;
};




// check if refresh token exists in sessions
userSchema.methods.isValidSession = function(token) {
  return this.sessions.some(session => session.token === token);
};

// Remove a single session (logout from one device)
userSchema.methods.removeSession = async function(token) {
  
  this.sessions = this.sessions.filter(session => session.token !== token);
   await this.save();
  

  
};

// Clear all sessions (logout from everywhere)
userSchema.methods.clearSessions = async function() {
  this.sessions = [];
  await this.save();
};

const userModel = mongoose.model("User", userSchema);
export default userModel
