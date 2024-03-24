import express from "express";
import prisma from "../prisma";
import { nodemailerService } from "../functions/nodemailer";

export const sendContactMailController = async (
    req: express.Request,
    res: express.Response
) => {
    const {
        admin_email,
        admin_email_password,
        email,
        name,
        message,
        motivo, 
        recaptcha_setting_key,
        recaptcha_token
    } = req.body
    console.log({
        admin_email,
        admin_email_password,
        email,
        name,
        message,
        motivo, 
        recaptcha_setting_key
    })

    if(
        !admin_email||
        !admin_email_password||
        !email||
        !name||
        !message||
        !motivo||
        !recaptcha_setting_key ||
        !recaptcha_token
    ) {
        return res.processResponse(400, "Envie todo os campos necessários")
    }

    const contactEmailSetting = await prisma.setting.findFirst({
        where: {
            option: admin_email
        }
    })
    const adminEmailPassword = await prisma.setting.findFirst({
        where: {
            option: admin_email_password
        }
    })



    const recaptchaSetting = await prisma.setting.findFirst({
        where: {
            option: recaptcha_setting_key
        }
    })

    if(!contactEmailSetting || !adminEmailPassword || !recaptchaSetting) {
        return res.processResponse(400, "O Site ainda não tem a opção de contato habilitada")
    }

    
    const response = await fetch(
        `https://hcaptcha.com/siteverify`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: `response=${recaptcha_token}&secret=${recaptchaSetting.valOption}`,
          method: "POST",
        }
      );
      const captchaValidation = await response.json() as any;


      if (!captchaValidation.success) {
        return res.processResponse(400, 'ReCaptcha Inválido ou Expirado')
      }
    const sended = await nodemailerService.sendMail({
        from: email,
        message: message,
        subject: motivo,
        pass: adminEmailPassword.valOption,
        to: contactEmailSetting.valOption
    })

    if(!sended) {
        return res.processResponse(404, "Ocorreu um erro ao enviar a mensagem de contato")
    }
    
    return res.processResponse(200, 'Mensagem de contato enviada')
}