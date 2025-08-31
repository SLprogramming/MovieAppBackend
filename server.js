
import dotEnv from "dotenv"
import { app } from "./app.js"
import { connectDB } from "./config/db.js"
dotEnv.config()


//create server
if(process.env.NODE_ENV == 'production'){
app.listen(process.env.PORT,() => {
    console.log(`server is running on http://:${process.env.PORT}`)
    connectDB()
})
}else {
    app.listen(process.env.PORT,process.env.LOCAL_IP_ADDRESS,() => {
    console.log(`server is running on http://${process.env.LOCAL_IP_ADDRESS}:${process.env.PORT}`)
    connectDB()
})
}
