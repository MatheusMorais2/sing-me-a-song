import {
  recommendationService,
  CreateRecommendationData,
} from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { prisma } from "../../src/database.js";
import { jest } from "@jest/globals";
import {
  conflictError,
  notFoundError,
  AppError,
} from "../../src/utils/errorUtils.js";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Insert", () => {
  it("Should insert a recommendation given the proper data", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);
    const recommendationRepositoryCreate = jest
      .spyOn(recommendationRepository, "create")
      .mockResolvedValueOnce(null);

    const data: CreateRecommendationData = {
      name: "Instant Crush - Daft Punk",
      youtubeLink: "https://www.youtube.com/watch?v=a5uQMwRMHcs",
    };

    await recommendationService.insert(data);

    expect(recommendationRepositoryCreate).toBeCalledTimes(1);
    expect(recommendationRepositoryCreate).toBeCalledWith(data);
  });

  it("Shouldn't insert a recommendation if it's a duplicate", async () => {
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
      id: 1,
      name: "carolina",
      youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
      score: 10,
    });

    const data: CreateRecommendationData = {
      name: "Instant Crush - Daft Punk",
      youtubeLink: "https://www.youtube.com/watch?v=a5uQMwRMHcs",
    };

    let thrownError: typeof conflictError;
    try {
      await recommendationService.insert(data);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
});

describe("Downvote", () => {
  it("Should downvote given a valid id", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: "carolina",
      youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
      score: 10,
    });

    const updateScore = jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({
        id: 1,
        name: "carolina",
        youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
        score: 9,
      });

    await recommendationService.downvote(1);

    expect(updateScore).toBeCalledTimes(1);
    expect(updateScore).toBeCalledWith(1, "decrement");
  });

  it("Should delete a recommendation if its score is bellow -5 points", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: "carolina",
      youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
      score: -5,
    });

    const updateScore = jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({
        id: 1,
        name: "carolina",
        youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
        score: -6,
      });

    const deleteCall = jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValueOnce(null);

    await recommendationService.downvote(1);

    expect(updateScore).toBeCalledTimes(1);
    expect(updateScore).toBeCalledWith(1, "decrement");
    expect(deleteCall).toBeCalledTimes(1);
    expect(deleteCall).toBeCalledWith(1);
  });
});

describe("Upvote", () => {
  it("Should upvote given a valid id", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: "carolina",
      youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
      score: 10,
    });

    const updateScore = jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({
        id: 1,
        name: "carolina",
        youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
        score: 11,
      });

    await recommendationService.upvote(1);

    expect(updateScore).toBeCalledTimes(1);
    expect(updateScore).toBeCalledWith(1, "increment");
  });
});

/* describe("Get id or fail", () => {
  it("Should find a recommendation given a valid id", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: "carolina",
      youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
      score: -5,
    });

    const search = await recommendationService.get
  })
}) */

describe("Get", () => {
  it("Should find all recommendations", async () => {
    const repositorySearch = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([
        {
          id: 1,
          name: "carolina",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 10,
        },
        {
          id: 2,
          name: "carolina2",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 10,
        },
        {
          id: 3,
          name: "carolina3",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 10,
        },
      ]);

    const search = await recommendationService.get();

    expect(repositorySearch).toBeCalledTimes(1);
    expect(search.length).toBe(3);
  });
});

describe("getTop", () => {
  it("Should find the top x recommendations", async () => {
    const topRepositorySearch = jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce([
        {
          id: 1,
          name: "carolina",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 10,
        },
        {
          id: 2,
          name: "carolina2",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 9,
        },
        {
          id: 3,
          name: "carolina3",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 8,
        },
      ]);

    const search = await recommendationService.getTop(3);

    expect(search.length).toBe(3);
    expect(topRepositorySearch).toBeCalledTimes(1);
    expect(topRepositorySearch).toBeCalledWith(3);
    expect(search[0].score > search[1].score).toBe(true);
  });
});

describe("getRandom", () => {
  it("Should return a random recommendation given a number < 0.7", async () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.5);

    const repositorySearch = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([
        {
          id: 3,
          name: "carolina3",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 11,
        },
        {
          id: 4,
          name: "carolina4",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 12,
        },
      ]);

    const search = await recommendationService.getRandom();

    expect(search).toHaveProperty("name");
    expect(repositorySearch).toBeCalledTimes(1);
    expect(repositorySearch).toBeCalledWith({
      score: 10,
      scoreFilter: "gt",
    });
  });

  it("Should return a random recommendation given a number > 0.7", async () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.8);
    const repositorySearch = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([
        {
          id: 3,
          name: "carolina3",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 6,
        },
        {
          id: 4,
          name: "carolina4",
          youtubeLink: "https://www.youtube.com/watch?v=s1PraTcSrso",
          score: 5,
        },
      ]);

    const search = await recommendationService.getRandom();

    expect(search).toHaveProperty("name");
    expect(repositorySearch).toBeCalledTimes(1);
    expect(repositorySearch).toBeCalledWith({
      score: 10,
      scoreFilter: "lte",
    });
  });

  it("Should throw a notFoundError when there's nothing to be found", async () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.8);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    let thrownError: typeof notFoundError;
    try {
      await recommendationService.getRandom();
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual({
      type: "not_found",
      message: "",
    });
  });
});

describe("findByName", () => {
  it("Should find a recommendation by its name", async () => {
    const repositorySearch = jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValue({
        name: "Frans cafe",
        youtubeLink: "https://www.youtube.com/watch?v=70OaycusLmc",
        id: 7,
        score: 15,
      });

    const search = await recommendationService.findByName("Frans cafe");

    expect(repositorySearch).toBeCalledTimes(1);
    expect(repositorySearch).toBeCalledWith("Frans cafe");
    expect(search.youtubeLink).toBe(
      "https://www.youtube.com/watch?v=70OaycusLmc"
    );
  });

  it("Should throw an error if no name was given", async () => {
    const repositorySearch = jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValue(null);

    let thrownError;
    try {
      await recommendationService.findByName("");
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual({
      type: "not_found",
      message: "",
    });
  });

  it("Should throw an error given an invalid name", async () => {
    const repositorySearch = jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValue(null);

    let thrownError;
    try {
      await recommendationService.findByName("Frans cafe");
    } catch (error) {
      thrownError = error;
    }

    expect(repositorySearch).toBeCalledTimes(1);
    expect(repositorySearch).toBeCalledWith("Frans cafe");
    expect(thrownError).toEqual({
      type: "not_found",
      message: "",
    });
  });
});
