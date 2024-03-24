import type { Request, Response, NextFunction } from "express";

export const processResponseMiddleware = (
  req: Response,
  res: Response,
  next: NextFunction,
) => {
  res.processResponse = (
    status = 500,
    message = "Erro interno",
    data = undefined,
  ) => {
    return res.status(status).json({
      status,
      message,
      data,
    });
  };

  next();
};
