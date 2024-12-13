import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { sponsorArticleService } from '../../services/sponsor-article-service';

export async function handleSponsorArticle(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		articleId: z.string().length(25),
		coins: z.number().positive(),
	});

	const { articleId, coins } = bodySchema.parse(request.body);

	const userId = (request.user as { id: string }).id;

	try {
		const result = await sponsorArticleService(userId, articleId, coins);
		reply.status(200).send(result);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		reply.status(400).send({ error: errorMessage });
	}
}
