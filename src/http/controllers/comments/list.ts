import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';

export async function listComments(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const comentsSchema = z.object({
		articleId: z.string().length(25),
	});

	const data = comentsSchema.parse(request.params);

	const { articleId } = data;

	const comments = await prisma.comment.findMany({
		where: { articleId },
		include: {
			author: {
				select: {
					id: true,
					userName: true,
				},
			},
			replies: {
				include: {
					author: {
						select: {
							id: true,
							userName: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: 'asc' },
	});

	return reply.status(200).send(comments);
}
