import express from "express";
import { tagsController } from "../controllers/tags";

export const tagsRouter = express.Router();

tagsRouter.get("/", tagsController.getAllTags);
tagsRouter.patch("/:id", tagsController.updateTag);
