import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { handleGetBalance } from './balance';
import { handleDislikeArticle } from './dislike';
import { handleLikeArticle } from './like';

export async function coinRoutes(app: FastifyInstance) {
	app.post('/coin/like', { onRequest: verifyJWT }, handleLikeArticle);
	app.post('/coin/dislike', { onRequest: verifyJWT }, handleDislikeArticle);
	app.post('/coin/balance', { onRequest: verifyJWT }, handleGetBalance);
}
