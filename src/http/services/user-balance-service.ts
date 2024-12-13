import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../errors/not-found-error';

export async function getUserBalanceService(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { coins: true },
	});

	if (!user) throw new NotFoundError('User not Found');

	return user.coins;
}
