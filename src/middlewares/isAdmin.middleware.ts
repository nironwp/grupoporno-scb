import express from "express";

export const isAdminMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { user } = req.decoded;

  if (!user || user.role === 1) {
    return res.processResponse(
      401,
      "Usuário não autorizado para essa operação",
    );
  }

  next();
};
