import { prisma } from '../../database/prisma';

export async function getRankedArticles(page?: number) {
	const halfLifeHours = Number(process.env.HALF_LIFE_HOURS);
	const now = new Date();

	const pageLimit = 10;
	const pageNumber = page ?? 1;

	const articles = await prisma.article.findMany({
		select: {
			id: true,
			title: true,
			slug: true,
			coins: true,
			createdAt: true,
			isSponsored: true,
			author: {
				select: {
					id: true,
					userName: true,
				},
			},
		},
		skip: (pageNumber - 1) * pageLimit || 0,
		take: pageLimit,
		orderBy: {
			createdAt: 'desc',
		},
	});

	const totalArticles = articles.length;
	const totalPages = Math.ceil(articles.length / pageLimit);

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

	const data = rankedArticles
		.sort((a, b) => b.rank - a.rank)
		.map((article) => ({
			...article,
			isSponsored: article.isSponsored,
		}));

	return {
		data,
		page: pageNumber,
		pageLimit,
		totalArticles,
		totalPages,
	};
}
