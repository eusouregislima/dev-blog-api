import { prisma } from '../../database/prisma';
import { UnauthorizedError } from '../../errors/unauthorized-error';

export async function deleteCommentsAsAuthorService(
	userId: string,
	commentId: string,
) {
	const comment = await prisma.comment.findUnique({
		where: { id: commentId, article: { authorId: userId } },
	});

	if (!comment) {
		throw new UnauthorizedError(
			'User is not authorized to delete this comment.',
		);
	}

	await prisma.comment.delete({ where: { id: commentId } });
}
