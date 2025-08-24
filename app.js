import express from "express"
import dotEnv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import {ErrorMiddleware} from "./middleware/error.js"
import userRouter from "./routes/user.route.js"
import movieRouter from "./routes/movie.route.js"
import planRouter from "./routes/plan.route.js"
import purchaseRequestRouter from "./routes/purchaseRequest.route.js"
import paymentTypeRouter from "./routes/paymentType.route.js"
import bankAccountRouter from "./routes/bankAccount.route.js"


export const app = express()

dotEnv.config()

//body parser
app.use(express.json({limit:"50mb"}))

//cookie parser
app.use(cookieParser())

const allowedOrigins = [
  "http://192.168.110.125:5173",
  "http://192.168.110.125:5174"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ allow this origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies
}));

// app.use(cors({
//   origin: "http://192.168.110.125:5173", // exact frontend origin
//   credentials: true,                      // 🔑 allow cookies
// }));

// app.use(cors())


app.use("/api",userRouter)
app.use("/api",movieRouter)
app.use("/api/plan",planRouter)
app.use("/api/purchase",purchaseRequestRouter)
app.use("/api/payment",paymentTypeRouter)
app.use("/api/bankAccount",bankAccountRouter)


//api
app.get("/api/test",(req,res,next) => {
    res.status(200).json({
        success:true,
        message:"api is working"
    })
})

app.all("*",(req,res,next) => {
    const err = new Error(`Route ${req.originalUrl} is not Found! `)
    err.statusCode = 404
    next(err)
})

app.use(ErrorMiddleware)