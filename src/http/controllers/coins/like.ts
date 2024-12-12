import type { FastifyReply, FastifyRequest } from 'fastify';
import { likeArticle } from '../../services/coinService';

export async function handleLikeArticle(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { userId, articleId } = request.body as {
		userId: string;
		articleId: string;
	};

	try {
		await likeArticle(userId, articleId);
		reply.status(200).send({ message: 'Article liked successfully' });
	} catch (error) {
		reply.status(400).send({ error });
	}
}
