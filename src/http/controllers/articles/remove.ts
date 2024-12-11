import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { findArticleById } from './find';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		id: z.string().length(25),
	});

	const params = schema.parse(request.params);

	const article = await findArticleById(params.id);

	const authorId = (request.user as { id: string }).id;

	const user = await prisma.user.findUnique({
		where: {
			id: authorId,
		},
	});

	if (!user) {
		throw new NotFoundError('User does not exists.');
	}

	if (String(article.authorId) !== authorId.toString()) {
		throw new ForbiddenError('This article is fron another author.');
	}

	await prisma.article.delete({
		where: { id: article.id },
	});

	return reply.status(204).send();
}
