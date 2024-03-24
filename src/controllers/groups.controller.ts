import express from "express";
import prisma from "../prisma";
import { createMercadoPagoCheckout } from "../functions/createMp";


export const impulseGroupCreateCheckout =  async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      plan_id,
      group_id
    } = req.body;
    console.log(req.body)
    const plan = await prisma.plan.findFirst({
      where: {
        id: plan_id
      }
    })
  
    if(!plan) {
      return res.processResponse(400, "Plano Invalido")
    }

    const group = await prisma.group.findFirst({
      where: {
        id: group_id
      }
    })
    
    console.log(plan, group)
    
    if(!group) {
      return res.processResponse(400, "Grupo Invalido")
    }

    const payment = await prisma.payment.create({
      data: {
        groupId: group_id,
        planId: plan_id
      }
    })

    const checkout = await createMercadoPagoCheckout({
      childCardTitle: group.title,
      id: group.id+'',
      price: plan.value,
    }, payment.id)


    return res.processResponse(200, 'Checkout criado', checkout)
     
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao criar pagamento");
  }
}

export const groupsSearchController =  async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let take = 1000

    const { text } = req.query

    if(!text) {
      return res.processResponse(400, "Você não passou nenhum parametro válido para pesquisa")
    }

    console.log(text)
    const foundGroups = await prisma.group.findMany({
      where: {
        title: {
          contains: text as string
        }
      },
      take: take 
    });


    return res.processResponse(200, "Resultado da pesquisa", foundGroups)

  } catch (error) {
    console.log(error)
    return res.processResponse(500, "Erro ao buscar grupos")
  }
}

export const groupsFetchAllController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { categoryId, approved, limit, impulse }: any = req.query;

    let where = {};
    let take = 1000;

    if (!!categoryId) {
      where = {
        ...where,
        categoryId: parseInt(categoryId),
      };
    }

    if (!!approved) {
      where = {
        ...where,
        stApproved: approved === 1 || approved === "true",
      };
    }

    if(!!impulse) {
      where={
        ...where,
        impulse: true,
        impulse_end_date: {
          gte: new Date()
        } 
      }
    }

    if (!!limit) {
      take = parseInt(limit);
    }

    const findG = await prisma.group.findMany({
      where,
      take,
    });

    console.log(impulse, findG)
    return res.processResponse(
      200,
      "Lista de grupos consultada com sucesso",
      findG
    );
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao listar todos os grupos");
  }
};

export const groupsFetchOneController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { slug } = req.params;

    const findG = await prisma.group.findUnique({
      where: {
        slug,
      },
    });

    if (!findG) {
      return res.processResponse(400, "Nenhum grupo com esse slug encontrado");
    }

    return res.processResponse(200, "Grupo consultado com sucesso", findG);
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao listar todos um grupos");
  }
};

export const groupsCreateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, link, categoryId, description, banner_image, type } =
      req.body;
    const { user } = req.decoded;

    if (
      !title ||
      !link ||
      !categoryId ||
      !description ||
      !banner_image ||
      !type
    ) {
      return res.processResponse(400, "Preencha todos os campos");
    }

    const slug = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

    const findG = await prisma.group.findFirst({
      where: {
        OR: [
          {
            link,
          },
          {
            slug,
          },
        ],
      },
    });

    if (!!findG) {
      return res.processResponse(
        400,
        "Já existe um grupo com esse link ou com esse slug"
      );
    }

    const group = await prisma.group.create({
      data: {
        title,
        description,
        link,
        slug,
        categoryId,
        userIdCreated: user.id,
        bannerImage: banner_image,
        type,
      },
    });

    if (!group) {
      return res.processResponse(500, "Erro ao criar grupo");
    }

    return res.processResponse(200, "Grupo criado com sucesso", group);
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao criar um grupo");
  }
};

export const groupsUpdateController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const { user } = req.decoded;

    if (!id || !data) {
      return res.processResponse(400, "Preencha todos os campos");
    }

    const findG = await prisma.group.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!findG) {
      return res.processResponse(400, "Grupo não encontrado");
    }

    if (findG.userIdCreated !== user.id && user.role === 1) {
      return res.processResponse(
        400,
        "Você não tem permissão para atualizar este grupo"
      );
    }

    const group = await prisma.group.update({
      where: { id: parseInt(id) },
      data,
    });

    if (!group) {
      return res.processResponse(500, "Erro ao atualizar grupo");
    }

    return res.processResponse(200, "Grupo atualizado com sucesso", group);
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao atualizar grupo");
  }
};

export const groupsDeleteController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { user } = req.decoded;

    if (!id) {
      return res.processResponse(400, "Preencha todos os campos");
    }

    const findG = await prisma.group.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!findG) {
      return res.processResponse(400, "Grupo não encontrado");
    }

    if (findG.userIdCreated !== user.id && user.role === 1) {
      return res.processResponse(
        400,
        "Você não tem permissão para deletar este grupo"
      );
    }

    const group = await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    if (!group) {
      return res.processResponse(500, "Erro ao deletar grupo");
    }

    return res.processResponse(200, "Grupo deletado com sucesso", group);
  } catch (error) {
    console.error(error);

    return res.processResponse(500, "Erro ao deletar grupo");
  }
};
