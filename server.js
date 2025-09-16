
import dotEnv from "dotenv"
import { app } from "./app.js"
import { connectDB } from "./config/db.js"
import http from "http";
import { initSocket } from "./utils/socket.js";

dotEnv.config()

const server = http.createServer(app);
initSocket(server);


//create server

app.listen(process.env.PORT,() => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
    connectDB()
})
// server.listen(process.env.PORT,process.env.LOCAL_IP_ADDRESS,() => {
//     console.log(`server is running on http://${process.env.LOCAL_IP_ADDRESS}:${process.env.PORT}`)
//     connectDB()
// })