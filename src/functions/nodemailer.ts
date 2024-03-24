import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'



class NodeMailerFactory {
    constructor() {
     
    }


    async sendMail({pass,subject,from,message,to}: {
        pass: string,
        subject: string,
        message: string,
        to: string,
        from: string
    }) {
        console.log({pass,subject,from,message,to})
        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
              user: to,
              pass: pass
            }
        }));

        var mailOptions = {
            from,
            to: to,
            subject: subject + ' Enviado por '+from,
            text: message,
        };

        const mail =  await transporter.sendMail(mailOptions)  

        return mail.accepted
    }
}


export const nodemailerService = new NodeMailerFactory()