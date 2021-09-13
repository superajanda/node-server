import express from "express";
import { notesRouter } from "./notes";
import { tagsRouter } from "./tags";
import { usersRouter } from "./users";
import { ERROR_MESSAGES } from "../constants";

export const router = express.Router();

router.use("/notes", notesRouter);
router.use("/tags", tagsRouter);
router.use("/users", usersRouter);
router.use((req, res) => {
  res.status(404).json({ message: ERROR_MESSAGES.unknownRoute });
});
