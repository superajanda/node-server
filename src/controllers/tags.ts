import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants";

export interface IUpdateTagRequestBody {
  name: string;
}

async function getAllTags(req: Request, res: Response): Promise<void> {
  const tags = await prisma.tag.findMany({
    where: {
      authorId: req.context.user.id,
    },
  });

  res.json({ data: tags });
}

async function updateTag(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name }: IUpdateTagRequestBody = req.body;

  if (!name) {
    res.status(400).json({ message: ERROR_MESSAGES.invalidRequestBody });
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: { name },
  });

  res.json({ data: tag });
}

export const tagsController = {
  getAllTags,
  updateTag,
};
