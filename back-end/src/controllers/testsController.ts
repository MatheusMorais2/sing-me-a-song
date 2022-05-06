import { Request, Response } from "express";
import testsRepository from "../repositories/testsRepository.js";

async function resetDatabase(req: Request, res: Response) {
  console.log("chegou no reset database");
  await testsRepository.resetDatabase();
  return res.sendStatus(200);
}

async function seedDatabase(req: Request, res: Response) {
  console.log("chegou no seedDatabase");
  await testsRepository.seedDatabase();
  return res.sendStatus(201);
}

export default {
  resetDatabase,
  seedDatabase,
};
