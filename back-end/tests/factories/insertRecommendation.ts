import supertest from "supertest";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";
import app from "../../src/app.js";

export async function insertRecommendation(name: string, youtubeLink: string) {
  const recommendation: CreateRecommendationData = {
    name,
    youtubeLink,
  };
  const response = await supertest(app)
    .post("/recommendations/")
    .send(recommendation);

  return response;
}

export async function insertRecommendationWithScore(
  name: string,
  youtubeLink: string,
  score: number
) {
  const recommendation = {
    name,
    youtubeLink,
    score,
  };

  const response = await supertest(app)
    .post("/recommendations/")
    .send(recommendation);

  return response;
}
