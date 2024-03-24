import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const isAuthenticatedMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.processResponse(
      401,
      "Não foi possível pegar o token da requisição!",
    );
  }

  const token = authorization.replace("Bearer ", "");

  if (!token) {
    return res.processResponse(
      401,
      "O token da requisição está no formato errado!",
    );
  }

  const userFromToken: any = jwt.decode(token, {
    json: true,
  });

  if (!userFromToken) {
    return res.processResponse(401, "O token da requisição é inválido!");
  }

  const user = await prisma.users.findFirst({
    where: {
      id: userFromToken.id,
    },
  });

  if (!!user) {
    req.decoded = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        password: user.password,
        dt_created_at: user.dt_created_at,
      },
    };

    return next();
  }

  return res.processResponse(401, "Não foi possível autenticar o usuário");
};
