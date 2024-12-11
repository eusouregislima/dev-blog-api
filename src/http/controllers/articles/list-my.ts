import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';

export async function listMy(request: FastifyRequest, reply: FastifyReply) {
	const querySchema = z.object({
		title: z.string().max(255).optional(),
		tag: z.string().max(255).optional(),
		page: z.coerce.number().positive().optional(),
	});

	const filters = querySchema.parse(request.query);

	const { page, title, tag } = filters;

	const pageLimit = 10;
	const pageNumber = page ?? 1;
	const skip = (pageNumber - 1) * pageLimit;

	const authorId = (request.user as Record<string, unknown>).id as string;

	const articles = await prisma.article.findMany({
		where: {
			authorId,
			AND: [
				title ? { title: { contains: title, mode: 'insensitive' } } : {},
				tag ? { tags: { has: tag } } : {},
			],
		},
		select: {
			id: true,
			title: true,
			subtitle: true,
			tags: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					userName: true,
				},
			},
		},
		skip,
		take: pageLimit,
		orderBy: {
			createdAt: 'desc',
		},
	});

	const totalArticles = await prisma.article.count({
		where: {
			AND: [
				title ? { title: { contains: title, mode: 'insensitive' } } : {},
				tag ? { tags: { has: tag } } : {},
			],
		},
	});

	return reply.status(200).send({
		page: pageNumber,
		pageLimit,
		totalArticles,
		totalPages: Math.ceil(totalArticles / pageLimit),
		articles,
	});
}
