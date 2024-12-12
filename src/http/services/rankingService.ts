import { prisma } from '../../database/prisma';

const halfLifeHours = Number(process.env.HALF_LIFE_HOURS);

// TODO entender esse arquivo
// TODO gerar documentação

export async function getRankedArticles() {
	const now = new Date();

	const articles = await prisma.article.findMany({
		select: {
			id: true,
			title: true,
			slug: true,
			coins: true,
			createdAt: true,
			author: {
				select: {
					userName: true,
				},
			},
		},
	});

	const rankedArticles = articles.map((article) => {
		const hoursSincePost =
			(now.getTime() - new Date(article.createdAt).getTime()) /
			(1000 * 60 * 60);

		const rank = article.coins / (1 + hoursSincePost / halfLifeHours);

		return {
			...article,
			rank,
		};
	});

	return rankedArticles.sort((a, b) => b.rank - a.rank);
}
