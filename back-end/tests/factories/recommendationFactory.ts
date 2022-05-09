export default function recommendationBuilder(
  name: string,
  url: string,
  score: number
) {
  return {
    where: {
      name: name,
    },
    update: {},
    create: {
      name: name,
      youtubeLink: url,
      score: score,
    },
  };
}
