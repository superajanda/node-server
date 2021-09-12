import express from "express";
import { usersController } from "../controllers/users";

export const usersRouter = express.Router();

usersRouter.get("/", usersController.getAllUsers);
usersRouter.post("/", usersController.createUser);
usersRouter.delete("/", usersController.deleteUser);
