import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { NotFoundError } from '../../../errors/not-found-error';

export async function removeComment(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const schema = z.object({
		commentId: z.string().length(25),
	});

	const { commentId } = schema.parse(request.params);

	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
		include: { article: true },
	});

	if (!comment) {
		throw new NotFoundError('Comment not found');
	}

	const userId = (request.user as { id: string }).id;

	const isAuthorComment = comment.authorId === userId;
	const isArticleOwner = comment.article?.authorId === userId;

	if (!isAuthorComment && !isArticleOwner) {
		throw new ForbiddenError('You are not the author of this comment');
	}

	try {
		await prisma.comment.delete({
			where: { id: commentId },
		});

		return reply.status(200).send({ message: 'Comment successfully deleted' });
	} catch (error) {
		console.log(error);
		return reply
			.status(500)
			.send({ error: 'Oops, something went wrong, try again later...' });
	}
}
