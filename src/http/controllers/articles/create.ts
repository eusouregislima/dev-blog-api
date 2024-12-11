import type { FastifyReply, FastifyRequest } from 'fastify';
import slugify from 'slugify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { NotFoundError } from '../../../errors/not-found-error';
import { articleService } from '../../services/articleService';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const articleSchema = z.object({
		title: z.string().max(255),
		subtitle: z.string().max(500),
		content: z.string(),
		tags: z.array(z.string().max(255)),
	});

	const data = articleSchema.parse(request.body);

	const { title, subtitle, content, tags } = data;

	const authorId = (request.user as Record<string, unknown>).id as string;

	const author = await prisma.user.findUnique({
		where: { id: authorId },
	});

	if (!author) {
		throw new NotFoundError('User does not exists.');
	}

	const slug = slugify(title, {
		replacement: '-',
		remove: undefined,
		lower: true,
		strict: true,
		locale: 'vi',
		trim: true,
	});

	const createdArticle = await articleService.createArticle({
		slug,
		title,
		subtitle,
		content,
		tags: tags.map((tag) => tag.toLowerCase().trim()),
		authorId,
	});

	return reply.status(201).send(createdArticle);
}
