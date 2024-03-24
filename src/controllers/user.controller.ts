import express from "express";
import prisma from "../prisma";
import jwt from "jsonwebtoken";

export const userFetchAllController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let { page, pageSize }: any = req.body;
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10; // Default page size

    const users = await prisma.users.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return res.processResponse(
      200,
      "Lista de usuários consultada com sucesso",
      users
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao listar todos os usuários");
  }
};

export const userUpdateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user } = req.decoded;
    const {
      data,
    }: {
      data: any;
    } = req.body;

    if (user.role === 1 && user.id !== data.id) {
      return res.processResponse(
        400,
        "Você não tem permissão para atualizar este usuário"
      );
    }

    if (user.role === 1 && data.role !== 1) {
      return res.processResponse(
        400,
        "Você não tem permissão para atualizar o cargo do usuário"
      );
    }

    const userUpdated = await prisma.users.update({
      where: {
        id: data.id,
      },
      data,
    });

    if (!userUpdated) {
      return res.processResponse(500, "Erro ao atualizar usuário");
    }

    return res.processResponse(
      200,
      "Usuário atualizado com sucesso",
      userUpdated
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao atualizar usuário");
  }
};

export const userDeleteController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user } = req.decoded;
    const { id } = req.params;

    if (user.role === 1) {
      return res.processResponse(
        400,
        "Você não tem permissão para deletar este usuário"
      );
    }

    if (user.id === parseInt(id)) {
      return res.processResponse(400, "Você não pode deletar o seu usuário");
    }

    const userDeleted = await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });

    await prisma.group.deleteMany({
      where: {
        userIdCreated: parseInt(id)
      }
    })

    if (!userDeleted) {
      return res.processResponse(500, "Erro ao deletar usuário");
    }

    return res.processResponse(
      200,
      "Usuário deletado com sucesso",
      userDeleted
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao deletar usuário");
  }
};

export const userRefreshController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token } = req.params;

    if (!token || token === undefined) {
      return res.processResponse(400, "Token não informado");
    }

    const user: any = jwt.decode(token);

    if (!user) {
      return res.processResponse(400, "Token inválido");
    }

    const userUpdated = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userUpdated) {
      return res.processResponse(
        500,
        "Erro ao atualizar informações do usuário"
      );
    }

    return res.processResponse(
      200,
      "Usuário consultado com sucesso",
      userUpdated
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao validar token do usuário");
  }
};
