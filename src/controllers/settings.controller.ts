import express from "express";
import prisma from "../prisma";

export const settingsPatchController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { option, valOption } = req.body;
    console.log(option, valOption)
    const setting = await prisma.setting.upsert({
      where: {
        option,
      },
      update: {
        valOption,
      },
      create: {
        option,
        valOption,
      },
    });

    if (!setting) {
      return res.processResponse(
        400,
        "Não foi possível atualizar a configuração",
      );
    }

    return res.processResponse(200, "Configuração atualizada com sucesso");
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Falha ao inserir/atualizar configurações");
  }
};

export const settingsFetchAllController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const findSettings = await prisma.setting.findMany();

    if (!findSettings) {
      return res.processResponse(
        400,
        "Não foi possível listar as configurações",
      );
    }

    let settings = {};

    for (const setting of findSettings) {
      settings = { ...settings, [setting.option]: setting.valOption };
    }

    return res.processResponse(
      200,
      "Lista de configurações consultada com sucesso",
      settings,
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao listar todas as configurações");
  }
};
