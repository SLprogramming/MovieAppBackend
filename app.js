import express from "express";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middleware/error.js";
import userRouter from "./routes/user.route.js";
import movieRouter from "./routes/movie.route.js";
import planRouter from "./routes/plan.route.js";
import purchaseRequestRouter from "./routes/purchaseRequest.route.js";
import paymentTypeRouter from "./routes/paymentType.route.js";
import bankAccountRouter from "./routes/bankAccount.route.js";
import pusher from "./utils/pusher.js";

dotEnv.config();

const app = express();
//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

const allowedOrigins = [
  "https://movie-app-website-mu.vercel.app",
  "http://localhost:5174",
  "http://localhost:5173", // Added localhost for convenience
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Remove trailing slash if present for strict comparison
      const formattedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(formattedOrigin)) {
        callback(null, true);
      } else {
        callback(null, false); // Block gracefully
      }
    },
    credentials: true,
  }),
);

// app.use(cors({
//   origin: "http://192.168.110.125:5173", // exact frontend origin
//   credentials: true,                      // 🔑 allow cookies
// }));

// app.use(cors())

app.use("/api", userRouter);
app.use("/api", movieRouter);
app.use("/api/plan", planRouter);
app.use("/api/purchase", purchaseRequestRouter);
app.use("/api/payment", paymentTypeRouter);
app.use("/api/bankAccount", bankAccountRouter);

//api
app.get("/api/test", async (req, res, next) => {
  try {
    await pusher.trigger("admins", "purchaseRequest:created", "hello");
    res.status(200).json({
      success: true,
      message: "api is working",
    });
  } catch (error) {
    next(error);
  }
});

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} is not Found! `);
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);

export default app;
