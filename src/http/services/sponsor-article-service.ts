import { prisma } from '../../database/prisma';
import { ForbiddenError } from '../../errors/forbidden-error';
import { NotFoundError } from '../../errors/not-found-error';

export async function sponsorArticleService(
	userId: string,
	articleId: string,
	coins: number,
) {
	const minCoins = Number(process.env.MIN_COINS);

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new NotFoundError('User not found');

	const article = await prisma.article.findUnique({ where: { id: articleId } });
	if (!article) throw new NotFoundError('Article not found');

	const existingSponsorship = await prisma.sponsoredArticle.findUnique({
		where: { articleId },
	});
	if (existingSponsorship) {
		throw new ForbiddenError('This article is already sponsored.');
	}

	if (coins < minCoins) {
		throw new ForbiddenError(`Minimum sponsorship is ${minCoins} coins.`);
	}

	if (user.coins < coins) {
		throw new ForbiddenError('Insufficient coins');
	}

	await prisma.$transaction([
		prisma.user.update({
			where: { id: userId },
			data: { coins: { decrement: coins } },
		}),
		prisma.article.update({
			where: { id: articleId },
			data: { coins: { increment: coins }, isSponsored: true },
		}),
		prisma.sponsoredArticle.create({
			data: {
				userId,
				articleId,
			},
		}),
	]);

	return { message: 'Article sponsored successfully', articleId, coins };
}
