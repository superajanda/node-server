import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ERROR_MESSAGES } from "../constants";

interface ICreateUserRequestBody {
  email: string;
  name: string;
  // FIXME: Remove id for production
  id?: string;
}

// FIXME: Don't expose this function in production because of obvious reasons
async function getAllUsers(_req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany();

  res.json({ data: users });
}

// TODO: Implement a register system that sends a validation mail
async function createUser(req: Request, res: Response): Promise<void> {
  const { email, name, id }: ICreateUserRequestBody = req.body;

  if (!email || !name) {
    res.status(400).json({ message: ERROR_MESSAGES.invalidRequestBody });
  }

  try {
    const user = await prisma.user.create({ data: { email, name, id } });
    res.json({ data: user });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(400).json({ message: ERROR_MESSAGES.duplicateEmail });
      return;
    }
    res.status(400).json({ message: ERROR_MESSAGES.unknownError });
  }
}

// TODO: This is so sudden, add an email validation step for account deletion
async function deleteUser(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.delete({
    where: {
      id: req.context.user.id,
    },
  });

  res.json({ data: user });
}

export const usersController = {
  getAllUsers,
  createUser,
  deleteUser,
};
