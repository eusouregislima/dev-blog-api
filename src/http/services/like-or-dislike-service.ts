import { prisma } from '../../database/prisma';
import { ForbiddenError } from '../../errors/forbidden-error';
import { NotFoundError } from '../../errors/not-found-error';

export async function likeOrDislikeService(
	userId: string,
	articleId: string,
	authorId: string,
	type: 'LIKE' | 'DISLIKE',
) {
	const [user, article] = await Promise.all([
		prisma.user.findUnique({ where: { id: userId } }),
		prisma.article.findUnique({ where: { id: articleId } }),
	]);

	if (!user) throw new NotFoundError('User not found');
	if (!article) throw new NotFoundError('Article not found');

	const existingTransaction = await prisma.coinTransaction.findFirst({
		where: { userId, articleId },
	});
	if (existingTransaction) {
		throw new ForbiddenError('You have already interacted with this article');
	}

	if (user.coins <= 0) throw new ForbiddenError('Insufficient coins');

	const incrementValue = type === 'LIKE' ? 1 : -1;

	await prisma.$transaction([
		prisma.coinTransaction.create({
			data: {
				userId,
				articleId,
				type,
			},
		}),
		prisma.user.update({
			where: { id: userId },
			data: { coins: { decrement: 1 } },
		}),
		prisma.article.update({
			where: { id: articleId },
			data: { coins: { increment: incrementValue } },
		}),
		prisma.user.update({
			where: { id: authorId },
			data: { coins: { increment: incrementValue } },
		}),
	]);
}
