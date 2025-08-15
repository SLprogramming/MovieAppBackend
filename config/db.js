import dotEnv from "dotenv"
import mongoose from "mongoose"
dotEnv.config()

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URL);
		console.log("MongoDB connected: " + conn.connection.host);
	} catch (error) {
		console.error("Error connecting to MONGODB: " + error.message);
		// process.exit(1); // 1 means there was an error, 0 means success
		setTimeout(connectDB,5000)
	}
};

