import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getRankedArticles } from '../../services/rankingService';

export async function handleGetRankedArticles(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const querySchema = z.object({
		page: z.coerce.number().positive().optional(),
	});

	const { page } = querySchema.parse(request.query);

	try {
		const articles = await getRankedArticles(page);
		reply.status(200).send(articles);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		reply.status(500).send({ error: errorMessage });
	}
}
