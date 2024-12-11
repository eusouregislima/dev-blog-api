import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { NotFoundError } from '../../../errors/not-found-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const commentSchema = z.object({
		articleId: z.string().length(25),
		content: z.string().min(1).max(1000),
		parentId: z.string().optional(),
	});

	const data = commentSchema.parse(request.body);

	const { articleId, content, parentId } = data;

	const authorId = (request.user as { id: string }).id;

	const articleExists = await prisma.article.findUnique({
		where: { id: articleId },
	});

	if (!articleExists) {
		throw new NotFoundError('Article not found.');
	}

	if (parentId) {
		const parentComment = await prisma.comment.findUnique({
			where: { id: parentId },
		});

		if (!parentComment) {
			throw new NotFoundError('Parent comment not found.');
		}
	}

	const comment = await prisma.comment.create({
		data: {
			content,
			articleId,
			authorId,
			parentId: parentId ?? null,
		},
	});

	return reply.status(201).send(comment);
}
