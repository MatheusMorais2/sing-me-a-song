import { prisma } from "../database.js";

async function resetDatabase() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

async function seedDatabase() {
  await prisma.recommendation.create({
    data: {
      name: "It's a long way",
      youtubeLink: "https://www.youtube.com/watch?v=FGrkfY5voxg",
      score: 2,
    },
  });

  await prisma.recommendation.create({
    data: {
      name: "Terra",
      youtubeLink: "https://www.youtube.com/watch?v=WyxL_lbo4kM",
      score: 5,
    },
  });

  await prisma.recommendation.create({
    data: {
      name: "Extra",
      youtubeLink: "https://www.youtube.com/watch?v=klUpvVO_LYg",
      score: 0,
    },
  });
}

export default { resetDatabase, seedDatabase };
