import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { NotFoundError } from '../../../errors/not-found-error';

// TODO Colocar para o dono da postagem poder apagar qualquer comentário

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
		include: { replies: true },
	});

	if (!comment) {
		throw new NotFoundError('Comment not found');
	}

	const userId = (request.user as { id: string }).id;

	if (comment.authorId !== userId) {
		throw new ForbiddenError('You are not the author of this comment');
	}

	try {
		await prisma.comment.delete({
			where: { id: commentId },
		});

		return reply
			.status(200)
			.send({ message: 'Comentário apagado com sucesso' });
	} catch (error) {
		console.log(error);
		return reply
			.status(500)
			.send({ error: 'Ops, algo deu errado, tente novamente mais tarde...' });
	}
}
