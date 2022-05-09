import app from "../src/app.js";
import supertest from "supertest";
import { prisma } from "../src/database.js";
import { insertRecommendation } from "./factories/insertRecommendation.js";

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
  await prisma.$disconnect();
});

describe("POST at /recommendations/", () => {
  it("Should insert a recommendation given the proper data", async () => {
    const response = await insertRecommendation(
      "Music",
      "https://www.youtube.com/watch?v=1N8nP9YUotE"
    );
    expect(response.status).toBe(201);

    const recommendation = await supertest(app).get(
      "/recommendations/name/Music"
    );

    expect(recommendation).not.toBe(null);
  });

  it("Must not insert a recommendation given incorrect data", async () => {
    const response = await insertRecommendation(
      "",
      "https://www.youtube.com/watch?v=1N8nP9YUotE"
    );

    expect(response.status).toBe(422);
  });

  it("Should throw an error when inserting a recommendation with a name already in use", async () => {
    const response = await insertRecommendation(
      "Music",
      "https://www.youtube.com/watch?v=1N8nP9YUotE"
    );

    expect(response.status).toBe(409);
  });
});

describe("GET at /recommendations/", () => {
  it("Should return all recommendations", async () => {
    const response = await supertest(app).get("/recommendations/");

    expect(response.body.length).toBe(4);
    expect(response.status).toBe(200);
  });
});

describe("GET at /recommendations/random", () => {
  it("Sould return a random recommendation", async () => {
    const response = await supertest(app).get("/recommendations/random");

    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("youtubeLink");
    expect(response.body).toHaveProperty("score");
    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });
});

describe("GET at /recommendations/top/:amount", () => {
  it("Should return the top x recommendations", async () => {
    const response = await supertest(app).get("/recommendations/top/2");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].score > response.body[1].score).toBe(true);
  });
});

describe("GET at /recommendations/:id", () => {
  it("Should return the recommendation that has the given id", async () => {
    const recommendation = await supertest(app).get(
      "/recommendations/name/Drao"
    );
    const id = recommendation.body.id;
    const response = await supertest(app).get("/recommendations/" + id);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Drao");
  });

  it("Should return status 404 when given an id that doesnt exist", async () => {
    const id = 999999999999;
    const response = await supertest(app).get("/recommendations/" + id);
    expect(response.status).toBe(404);
  });
});

describe("POST at /recommendations/:id/upvote", () => {
  it("Should upvote the recommendation that has the given id", async () => {
    const recommendation = await supertest(app).get(
      "/recommendations/name/Drao"
    );
    const id = recommendation.body.id;
    const scoreBefore = recommendation.body.score;
    const response = await supertest(app).post(`/recommendations/${id}/upvote`);
    expect(response.status).toBe(200);

    const recommendationAfter = await supertest(app).get(
      `/recommendations/${id}`
    );
    const scoreAfter = recommendationAfter.body.score;
    expect(scoreBefore === scoreAfter - 1).toBe(true);
  });

  it("Should return status 404 when given an id that doesnt exist", async () => {
    const id = 999999999999;
    const response = await supertest(app).get("/recommendations/" + id);
    expect(response.status).toBe(404);
  });
});

describe("POST at /recommendations/:id/downvote", () => {
  it("Should downvote the recommendation that has the given id", async () => {
    const recommendation = await supertest(app).get(
      "/recommendations/name/Drao"
    );
    const id = recommendation.body.id;
    const scoreBefore = recommendation.body.score;
    const response = await supertest(app).post(
      `/recommendations/${id}/downvote`
    );
    expect(response.status).toBe(200);

    const recommendationAfter = await supertest(app).get(
      `/recommendations/${id}`
    );
    const scoreAfter = recommendationAfter.body.score;
    expect(scoreBefore === scoreAfter + 1).toBe(true);
  });

  it("Should return status 404 when given an id that doesnt exist", async () => {
    const id = 999999999999;
    const response = await supertest(app).get("/recommendations/" + id);
    expect(response.status).toBe(404);
  });
});

describe("GET at /recommendations/name/:name", () => {
  it("Should return a recommendation based on its name", async () => {
    const name = "Drao";
    const response = await supertest(app).get("/recommendations/name/" + name);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Drao");
    expect(response.body.youtubeLink).toBe(
      "https://www.youtube.com/watch?v=LAsAYoZ0aKs"
    );
  });

  it("Should return status 404 when given an name that doesnt exist", async () => {
    const name = "asuidhasojdnsadon";
    const response = await supertest(app).get("/recommendations/name/" + name);
    expect(response.status).toBe(404);
  });
});
