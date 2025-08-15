import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"
import dotEnv from "dotenv"
import {__dirname} from "../config/filePath.js"

dotEnv.config()

const sendMail = async (option) => {
    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT || '587'),
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    })

    const {email,subject,template,data} = option

    //get the path to the email template file
    const templatePath = path.join(__dirname,"../mails",template)

    //render the email template with ejs
    const html = await ejs.renderFile(templatePath,data)

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions)

}

export default sendMail

