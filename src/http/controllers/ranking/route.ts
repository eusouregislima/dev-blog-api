import type { FastifyInstance } from 'fastify';
import { handleGetRankedArticles } from './ranking';

export async function rankingRoutes(app: FastifyInstance) {
	app.get('/ranking', handleGetRankedArticles);
}
