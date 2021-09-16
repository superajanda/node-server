import express from "express";
import { tagsController } from "../controllers/tags";

export const tagsRouter = express.Router();

tagsRouter.get("/", tagsController.getAllTags);
tagsRouter.get("/:id", tagsController.getTag);
tagsRouter.post("/", tagsController.createTag);
tagsRouter.patch("/:id", tagsController.updateTag);
tagsRouter.delete("/:id", tagsController.deleteTag);
