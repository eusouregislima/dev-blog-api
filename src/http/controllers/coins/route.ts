import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { handleGetBalance } from './balance';
import { handleLikeArticleOrDislike } from './like-or-dislike';
import { handleSponsorArticle } from './sponsor-article';

export async function coinRoutes(app: FastifyInstance) {
	app.post('/coin/like', { onRequest: verifyJWT }, handleLikeArticleOrDislike);
	app.post('/coin/balance', { onRequest: verifyJWT }, handleGetBalance);
	app.post('/coin/sponsor', { onRequest: verifyJWT }, handleSponsorArticle);
}
