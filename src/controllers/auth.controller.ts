import express from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRegisterController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { email, password, recaptcha_token, recaptcha_setting_key } = req.body;

    if (!email || !password) {
      return res.processResponse(400, "Campos da requisição inválidos");
    }


    if(recaptcha_setting_key) {
      const db_secret_setting = await prisma.setting.findFirst({
        where: {
          option: recaptcha_setting_key
        }
      })

      
      if(!db_secret_setting) {
        return res.processResponse(201, 'ReCaptcha não configurado')
      }

      const response = await fetch(
        `https://hcaptcha.com/siteverify`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: `response=${recaptcha_token}&secret=${db_secret_setting.valOption}`,
          method: "POST",
        }
      );
      const captchaValidation = await response.json() as any;


      if (!captchaValidation.success) {
        return res.processResponse(400, 'ReCaptcha Inválido ou Expirado')
      }
  
    }

    const findU = await prisma.users.findFirst({ where: { email } });

    if (findU) {
      return res.processResponse(400, "Já existe um usuário com esse e-mail!");
    }

    const passwordCrypted = await bcrypt.hash(password, 4);

    const user = await prisma.users.create({
      data: {
        email,
        password: passwordCrypted,
      },
    });

    if (!user) {
      return res.processResponse(400, "Erro ao criar usuário");
    }

    const token = jwt.sign(user, process.env.SECRET_KEY || "");

    return res.processResponse(200, "Usuário criado com sucesso", { token });
  } catch (error) {
    console.error(error);

    return res.processResponse(400, "Erro ao criar usuário");
  }
};


export const authLoginController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { email, password, recaptcha_token, recaptcha_setting_key} = req.body;

    if (!email || !password) {
      return res.processResponse(400, "Campos da requisição inválidos");
    }

    if(recaptcha_setting_key) {
      const db_secret_setting = await prisma.setting.findFirst({
        where: {
          option: recaptcha_setting_key
        }
      })

      
      if(!db_secret_setting) {
        return res.processResponse(201, 'ReCaptcha não configurado')
      }

      const response = await fetch(
        `https://hcaptcha.com/siteverify`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: `response=${recaptcha_token}&secret=${db_secret_setting.valOption}`,
          method: "POST",
        }
      );
      const captchaValidation = await response.json() as any;


      if (!captchaValidation.success) {
        return res.processResponse(400, 'ReCaptcha Inválido ou Expirado')
      }
  
    }
    const findU = await prisma.users.findFirst({ where: { email } });

    if (!findU) {
      return res.processResponse(400, "Esse usuário não possúi cadastro");
    }

    const isValid = await bcrypt.compare(password, findU.password);

    if (!isValid) {
      return res.processResponse(
        400,
        "A senha inserida não confere com o usuário",
      );
    }

    const token = jwt.sign(findU, process.env.SECRET_KEY || "");

    return res.processResponse(200, "Usuário autenticado com sucesso", {
      token,
    });
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao autenticar o usuário");
  }
};
