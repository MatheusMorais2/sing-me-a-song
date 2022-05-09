import { prisma } from "../src/database.js";
import recommendationBuilder from "../tests/factories/recommendationFactory.js";

async function main() {
  await prisma.recommendation.upsert(
    recommendationBuilder(
      "Drao",
      "https://www.youtube.com/watch?v=LAsAYoZ0aKs",
      7
    )
  );

  await prisma.recommendation.upsert(
    recommendationBuilder(
      "You know I'm no good - Arctic Monkeys",
      "https://www.youtube.com/watch?v=NEboIt0qA30",
      5
    )
  );

  await prisma.recommendation.upsert(
    recommendationBuilder(
      "Sonhos - Caetano Veloso",
      "https://www.youtube.com/watch?v=1H7LI5Sv7M4",
      2
    )
  );
}

main()
  .catch((e) => {
    console.log("error: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
