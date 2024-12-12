import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../errors/not-found-error';

//TODO fornecer/remover 1 coin para o dono do artigo também

export async function likeArticle(userId: string, articleId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) throw new Error('User not found');
	if (user.coins <= 0) throw new Error('Insufficient coins');

	await prisma.$transaction([
		prisma.user.update({
			where: { id: userId },
			data: { coins: { decrement: 1 } },
		}),
		prisma.article.update({
			where: { id: articleId },
			data: { coins: { increment: 1 } },
		}),
		prisma.coinTransaction.create({
			data: {
				userId,
				articleId,
				type: 'LIKE',
			},
		}),
	]);
}

export async function dislikeArticle(userId: string, articleId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user || user.coins <= 0) throw new Error('Insufficient coins');

	await prisma.$transaction([
		prisma.user.update({
			where: { id: userId },
			data: { coins: { decrement: 1 } },
		}),
		prisma.article.update({
			where: { id: articleId },
			data: { coins: { decrement: 1 } },
		}),
		prisma.coinTransaction.create({
			data: {
				userId,
				articleId,
				type: 'DISLIKE',
			},
		}),
	]);
}

export async function getUserBalance(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { coins: true },
	});

	if (!user) throw new NotFoundError('User not Found');

	return user.coins;
}
