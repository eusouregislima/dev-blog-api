import { prisma } from '../../database/prisma';

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
