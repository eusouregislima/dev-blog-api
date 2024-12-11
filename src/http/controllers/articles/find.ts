import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { NotFoundError } from '../../../errors/not-found-error';

export async function findArticleById(id: string) {
	const article = await prisma.article.findUnique({
		where: {
			id,
		},
	});

	if (!article) {
		throw new NotFoundError('Article does not exists.');
	}

	return article;
}

export async function find(request: FastifyRequest, reply: FastifyReply) {
	const findSchema = z.object({
		id: z.string().length(25),
	});

	const params = findSchema.parse(request.params);

	const id = params.id;

	const article = await findArticleById(id);

	return reply.status(200).send(article);
}
