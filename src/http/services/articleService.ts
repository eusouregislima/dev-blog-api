import { prisma } from '../../database/prisma';
import { BadRequestError } from '../../errors/bad-request-error';

export const articleService = {
	async createArticle(data: {
		slug: string;
		title: string;
		subtitle: string;
		content: string;
		tags: string[];
		authorId: string;
	}) {
		const existingArticle = await prisma.article.findUnique({
			where: { title: data.title },
		});

		if (existingArticle) {
			throw new BadRequestError('Article title already exists.');
		}

		await prisma.user.update({
			where: { id: data.authorId },
			data: { coins: { increment: 5 } },
		});

		return await prisma.article.create({
			data,
		});
	},
};
