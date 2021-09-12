import express from "express";
import { notesController } from "../controllers/notes";

export const notesRouter = express.Router();

notesRouter.get("/", notesController.getAllNoteMetadata);
notesRouter.get("/:id", notesController.getNote);
notesRouter.post("/", notesController.createNote);
notesRouter.patch("/:id", notesController.updateNote);
notesRouter.delete("/:id", notesController.deleteNote);
