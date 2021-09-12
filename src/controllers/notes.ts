import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants";

export interface ICreateNoteRequestBody {
  title: string;
}

export interface IUpdateNoteRequestBody {
  title?: string;
  content?: string;
  tagNames?: string[];
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
  });

  res.json({ data: note });
}

// TODO: Filter notes by tag if tag argument is given
async function getAllNoteMetadata(req: Request, res: Response): Promise<void> {
  const notes = await prisma.note.findMany({
    where: {
      authorId: req.context.user.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  res.json({ data: notes });
}

async function getNote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const note = await prisma.note.findFirst({
    where: {
      authorId: req.context.user.id,
      id,
    },
  });

  if (!note) {
    res.status(404).json({ message: ERROR_MESSAGES.invalidContentId });
    return;
  }

  res.json({ data: note });
}

interface IUpdateTagsArgs {
  updatedTagNames: string[];
  noteId: string;
  authorId: string;
}

// FIXME: This function is throwing error
async function updateTags({
  updatedTagNames,
  noteId,
  authorId,
}: IUpdateTagsArgs): Promise<boolean> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      tags: {
        include: {
          tag: {
            select: {
              _count: true,
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (!note || note.authorId !== authorId) {
    return false;
  }

  const tagNames = note.tags.map(({ tag }) => tag.name);
  const addedTagNames = updatedTagNames.filter(
    (updatedTagName) => !tagNames.includes(updatedTagName)
  );
  const addedTags = await Promise.all(
    addedTagNames.map((tagName) =>
      prisma.tag.create({
        data: {
          name: tagName,
          authorId,
        },
      })
    )
  );

  // FIXME: This only updated recently added tags and wipes old ones. Instead,
  // keep the old tags, add new ones and remove the removed ones.
  await prisma.note.update({
    where: { id: noteId },
    data: {
      tags: {
        connect: addedTags.map((addedTag) => ({
          tagId_noteId: {
            noteId,
            tagId: addedTag.id,
          },
        })),
      },
    },
  });

  const removedTags = note.tags
    .map(({ tag }) => tag)
    .filter(
      (tag) =>
        !updatedTagNames.some((updatedTagName) => tag.name == updatedTagName)
    );
  const unusedTags = removedTags.filter(
    (removedTag) => removedTag._count?.notes === 0
  );
  const unusedTagIds = unusedTags.map((tag) => tag.id);
  await prisma.note.deleteMany({
    where: {
      id: { in: unusedTagIds },
    },
  });

  return true;
}

async function updateNote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, content, tagNames }: IUpdateNoteRequestBody = req.body;

  if (!title && !content && !tagNames) {
    res.status(400).json({ message: ERROR_MESSAGES.emptyRequestBody });
    return;
  }

  if (tagNames) {
    const isError = await updateTags({
      updatedTagNames: tagNames,
      noteId: req.params.id,
      authorId: req.context.user.id,
    });

    if (isError) {
      res.json({ message: ERROR_MESSAGES });
    }
  }

  const note = await prisma.note.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  res.json({ data: note });
}

async function deleteNote(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  // Get the note by note id for only this user. The reason I don't use delete()
  // directly is because some other user might brute-force and find a valid id
  // that belongs to another user's note.
  const note = await prisma.note.findFirst({
    where: {
      id,
      authorId: req.context.user.id,
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
