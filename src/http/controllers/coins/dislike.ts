import type { FastifyReply, FastifyRequest } from 'fastify';
import { dislikeArticle } from '../../services/coinService';

export async function handleDislikeArticle(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { userId, articleId } = request.body as {
		userId: string;
		articleId: string;
	};

	try {
		await dislikeArticle(userId, articleId);
		reply.status(200).send({ message: 'Article disliked successfully' });
	} catch (error) {
		reply.status(400).send({ error });
	}
}
