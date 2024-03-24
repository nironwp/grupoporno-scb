import express from "express";
import prisma from "../prisma";

export const getAllPlans = async (
    req: express.Request,
    res: express.Response
) => {
    const plans = await prisma.plan.findMany()

    return res.processResponse(
        200,
        "Lista de planos consultada com sucesso",
        plans
      );
}