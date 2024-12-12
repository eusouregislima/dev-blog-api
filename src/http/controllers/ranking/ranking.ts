import type { FastifyReply, FastifyRequest } from 'fastify';
import { getRankedArticles } from '../../services/rankingService';

//TODO verificar relação entre o hanking e a paginação

export async function handleGetRankedArticles(
	_: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const articles = await getRankedArticles();
		reply.status(200).send(articles);
	} catch (error) {
		reply.status(500).send({ error });
	}
}
