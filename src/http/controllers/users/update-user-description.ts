import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { updatedDescriptionService } from '../../services/userService';

export async function updateUserDescription(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const userSchema = z.object({
		description: z
			.string()
			.min(10, 'A descrição precisa ter no mínimo 10 caracteres')
			.max(1000, 'Ops, limite máximo de 1000 caracteres atingido.'),
	});

	const { description } = userSchema.parse(request.body);

	const userId = (request.user as { id: string }).id;
	if (!userId) {
		return reply.status(401).send({ error: 'Unauthorized' });
	}

	const updatedUser = await updatedDescriptionService(userId, description);

	return reply.status(200).send({
		message: 'Description updated successfully',
		user: {
			id: updatedUser.id,
			description: updatedUser.description,
		},
	});
}
