import express from "express";
import { notesRouter } from "./notes";
import { tagsRouter } from "./tags";
import { usersRouter } from "./users";

export const router = express.Router();

router.use("/notes", notesRouter);
router.use("/tags", tagsRouter);
router.use("/users", usersRouter);
