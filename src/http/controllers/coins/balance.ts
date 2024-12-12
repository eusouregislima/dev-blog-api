import type { FastifyReply, FastifyRequest } from 'fastify';
import { getUserBalance } from '../../services/coinService';

//TODO limitar a 1 like ou deslike

export async function handleGetBalance(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const userId = (request.user as { id: string }).id;

	try {
		const balance = await getUserBalance(userId);
		reply.status(200).send({ balance });
	} catch (error) {
		reply.status(400).send({ error });
	}
}
