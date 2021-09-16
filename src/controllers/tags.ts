import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants";

const tagsWithNestedNotesFilter = {
  select: {
    id: true,
    name: true,
    notes: {
      select: {
        note: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    },
  },
};

async function getTag(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const tagWithNestedNotes = await prisma.tag.findUnique({
    where: { id },
    ...tagsWithNestedNotesFilter,
  });

  if (!tagWithNestedNotes) {
    res.status(404).json({ message: ERROR_MESSAGES.invalidContentId });
    return;
  }

  const tag = {
    ...tagWithNestedNotes,
    notes: tagWithNestedNotes.notes.map(({ note }) => note),
  };

  res.json({ data: tag });
}

async function getAllTags(req: Request, res: Response): Promise<void> {
  const tags = await prisma.tag.findMany({
    where: {
      authorId: req.context.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  res.json({ data: tags });
}

interface ICreateTagRequestBody {
  noteId: string;
  name: string;
}

async function createTag(req: Request, res: Response): Promise<void> {
  const { noteId, name }: ICreateTagRequestBody = req.body;

  if (!noteId || !name) {
    res.status(400).json({ message: ERROR_MESSAGES.invalidRequestBody });
    return;
  }

  const tag = await prisma.tag.create({
    data: {
      name,
      authorId: req.context.user.id,
      notes: {
        create: {
          noteId,
          authorId: req.context.user.id,
        },
      },
    },
  });

  res.json({ data: tag });
}

interface IUpdateTagRequestBody {
  name: string;
}

async function updateTag(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name }: IUpdateTagRequestBody = req.body;

  if (!name) {
    res.status(400).json({ message: ERROR_MESSAGES.invalidRequestBody });
    return;
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: { name },
    select: {
      id: true,
      name: true,
    },
  });

  res.json({ data: tag });
}

async function deleteTag(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const tag = await prisma.tag.delete({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
  res.json({ data: tag });
}

export const tagsController = {
  getTag,
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};
