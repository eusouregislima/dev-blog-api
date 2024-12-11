import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { NotFoundError } from '../../../errors/not-found-error';

export async function updateComment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		id: z.string().length(25),
	});

	const { id } = paramsSchema.parse(request.params);

	const comment = await prisma.comment.findUnique({
		where: { id },
	});

	if (!comment) {
		throw new NotFoundError('Comment not found');
	}

	const bodySchema = z.object({
		content: z.string().min(1, 'Content cannot be empty').max(1000),
	});

	const { content } = bodySchema.parse(request.body);

	const userId = (request.user as { id: string }).id;

	if (comment.authorId !== userId) {
		throw new ForbiddenError('You are not the author of this comment');
	}

	const updateComment = await prisma.comment.update({
		where: { id },
		data: { content },
	});

	return reply.status(200).send(updateComment);
}
