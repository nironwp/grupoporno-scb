import express from "express";
import prisma from "../prisma";

export const categoryFetchAllController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const categories = await prisma.category.findMany();

    return res.processResponse(200, "Categorias obtidas com sucesso", {
      categories,
    });
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Falha ao buscar categorias");
  }
};

export const categoryFetchOneController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    return res.processResponse(200, "Categoria obtida com sucesso", {
      category,
    });
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Falha ao buscar categoria");
  }
};

export const categoryCreateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, slug, banner_image } = req.body;

    if (!title || !slug || !banner_image) {
      return res.processResponse(400, "Preencha todos os campos");
    }

    const findC = await prisma.category.findFirst({
      where: {
        slug,
      },
    });

    if (!!findC) {
      return res.processResponse(400, "Já existe uma categoria com esse slug");
    }

    const category = await prisma.category.create({
      data: {
        title,
        slug,
        banner_image,
      },
    });

    if (!category) {
      return res.processResponse(500, "Erro ao criar categoria");
    }

    return res.processResponse(200, "Categoria criada com sucesso", category);
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao criar categoria");
  }
};

export const categoryUpdateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || !data) {
      return res.processResponse(400, "Preencha todos os campos");
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data,
    });

    if (!category) {
      return res.processResponse(500, "Erro ao atualizar categoria");
    }

    return res.processResponse(
      200,
      "Categoria atualizada com sucesso",
      category
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao atualizar categoria");
  }
};

export const categoryDeleteController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.processResponse(400, "Preencha todos os campos");
    }

    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.processResponse(500, "Erro ao deletar categoria");
    }

    return res.processResponse(200, "Categoria deletada com sucesso", category);
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao deletar categoria");
  }
};
