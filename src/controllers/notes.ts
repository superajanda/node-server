import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants";

const notesWithNestedTagsSelect = {
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export interface ICreateNoteRequestBody {
  title: string;
}

async function createNote(req: Request, res: Response): Promise<void> {
  const { title }: ICreateNoteRequestBody = req.body;

  if (!title) {
    res.status(400).json({ message: ERROR_MESSAGES.invalidRequestBody });
    return;
  }

  const note = await prisma.note.create({
    data: {
      title,
      content: `# ${title}\n`,
      authorId: req.context.user.id,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      content: true,
    },
  });

  res.json({ data: note });
}

async function getAllNoteMetadata(req: Request, res: Response): Promise<void> {
  const notesWithNestedTags = await prisma.note.findMany({
    where: {
      authorId: req.context.user.id,
    },
    select: notesWithNestedTagsSelect,
  });

  if (!notesWithNestedTags) {
    res.status(400).json({ message: ERROR_MESSAGES.invalidContentId });
    return;
  }

  const notes = notesWithNestedTags.map((note) => {
    return {
      ...note,
      tags: note.tags.map(({ tag }) => tag),
    };
  });

  res.json({ data: notes });
}

async function getNote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const noteWithNestedTags = await prisma.note.findUnique({
    where: { id },
    select: {
      ...notesWithNestedTagsSelect,
      content: true,
    },
  });

  if (!noteWithNestedTags) {
    res.status(404).json({ message: ERROR_MESSAGES.invalidContentId });
    return;
  }

  const note = {
    ...noteWithNestedTags,
    tags: noteWithNestedTags.tags.map(({ tag }) => tag),
  };

  res.json({ data: note });
}

export interface IUpdateNoteRequestBody {
  title?: string;
  content?: string;
  tagIds?: string[];
}

async function updateNote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, content, tagIds }: IUpdateNoteRequestBody = req.body;

  if (!title && !content && !tagIds) {
    res.status(400).json({ message: ERROR_MESSAGES.emptyRequestBody });
    return;
  }

  try {
    const noteWithNestedTags = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        tags: {
          create: tagIds?.map((tagId) => ({
            tagId,
            authorId: req.context.user.id,
          })),
        },
      },
      select: {
        ...notesWithNestedTagsSelect,
        content: true,
      },
    });

    if (!noteWithNestedTags) {
      res.json({ messsage: ERROR_MESSAGES.invalidContentId });
      return;
    }

    const note = {
      ...noteWithNestedTags,
      tags: noteWithNestedTags.tags.map(({ tag }) => tag),
    };

    res.json({ data: note });
  } catch (e) {
    res.status(400).json({ message: ERROR_MESSAGES.duplicateContentId });
  }
}

async function deleteNote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  // Get the note by note id for only this user. The reason I don't use delete()
  // directly is because some other user might brute-force and find a valid id
  // that belongs to another user's note.
  const note = await prisma.note.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      content: true,
    },
  });

  if (!note) {
    res.status(404).json({ message: ERROR_MESSAGES.invalidContentId });
    return;
  }

  await prisma.note.delete({ where: { id: note.id } });

  res.json({ data: note });
}

export const notesController = {
  createNote,
  getAllNoteMetadata,
  getNote,
  updateNote,
  deleteNote,
};
