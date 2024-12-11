import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { NotFoundError } from '../../../errors/not-found-error';

export async function findBySlug(request: FastifyRequest, reply: FastifyReply) {
	const slugSchema = z.object({
		slug: z.string().max(255),
	});

	const params = slugSchema.parse(request.params);

	const slug = params.slug;

	const article = await prisma.article.findMany({
		where: {
			slug,
		},
	});

	if (!article) {
		throw new NotFoundError('Article does not exists.');
	}

	return reply.status(200).send(article);
}
