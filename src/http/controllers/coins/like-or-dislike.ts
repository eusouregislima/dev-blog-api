import type { FastifyReply, FastifyRequest } from 'fastify';
import { likeOrDislikeService } from '../../services/like-or-dislike-service';

export async function handleLikeArticleOrDislike(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { articleId, type, authorId } = request.body as {
		articleId: string;
		authorId: string;
		type: 'LIKE' | 'DISLIKE';
	};

	const userId = (request.user as { id: string }).id;

	try {
		await likeOrDislikeService(userId, articleId, authorId, type);

		reply.status(200).send({
			message: `${type === 'LIKE' ? 'Like' : 'Dislike'} article successfully.`,
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		reply.status(400).send({ error: errorMessage });
	}
}
