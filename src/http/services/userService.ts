import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../errors/not-found-error';

export const userService = {
	async createUser(data: {
		userName: string;
		email: string;
		password: string;
		description?: string;
	}) {
		return await prisma.user.create({
			data,
		});
	},
};

export async function updatedDescriptionService(
	userId: string,
	description: string,
) {
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		throw new NotFoundError('User not found.');
	}

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: { description },
	});

	return updatedUser;
}
