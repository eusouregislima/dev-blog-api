import type { FastifyReply, FastifyRequest } from 'fastify';
import { getUserBalanceService } from '../../services/user-balance-service';

export async function handleGetBalance(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const userId = (request.user as { id: string }).id;

	try {
		const balance = await getUserBalanceService(userId);
		reply.status(200).send({ balance });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido';
		reply.status(400).send({ error: errorMessage });
	}
}
