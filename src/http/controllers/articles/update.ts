import type { FastifyReply, FastifyRequest } from 'fastify';
import slugify from 'slugify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { findArticleById } from './find';

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		id: z.string().length(25),
	});

	const params = schema.parse(request.params);

	const articleId = params.id;

	const article = await findArticleById(articleId);

	const authorId = (request.user as Record<string, unknown>).id as string;

	if (article.authorId !== authorId) {
		throw new ForbiddenError('This article is fron another author.');
	}

	const articleSchema = z.object({
		title: z.string().max(255).optional(),
		subtitle: z.string().max(500).optional(),
		content: z.string().optional(),
		tags: z.array(z.string().max(255)).optional(),
	});

	const data = articleSchema.parse(request.body);
	const { title, subtitle, content, tags } = data;

	let slug: string | undefined;
	if (title) {
		slug = slugify(title, {
			replacement: '-',
			remove: undefined,
			lower: true,
			strict: true,
			locale: 'vi',
			trim: true,
		});
	}

	const existingArticle = await prisma.article.findFirst({
		where: { title, NOT: { id: articleId } },
	});

	if (existingArticle) {
		throw new ForbiddenError('Another article with this title already exists.');
	}

	const updatedTags = tags
		? tags.map((tag) => tag.toLowerCase().trim())
		: article.tags;

	const updatedArticle = await prisma.article.update({
		where: { id: articleId },
		data: {
			title,
			subtitle,
			content,
			tags: updatedTags,
			slug: slug || article.slug,
		},
	});

	return reply.status(200).send(updatedArticle);
}
