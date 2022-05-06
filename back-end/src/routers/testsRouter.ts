import { Router } from "express";
import testsController from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post("/reset-database", testsController.resetDatabase);
testsRouter.post("/seed-database", testsController.seedDatabase);

export default testsRouter;
