
import dotEnv from "dotenv"
import { app } from "./app.js"
import { connectDB } from "./config/db.js"
dotEnv.config()


//create server

app.listen(process.env.PORT,process.env.LOCAL_IP_ADDRESS,() => {
    console.log(`server is running on http://${process.env.LOCAL_IP_ADDRESS}:${process.env.PORT}`)
    connectDB()
})