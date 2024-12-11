import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';
import { listComments } from './list';
import { removeComment } from './remove';
import { updateComment } from './update';

export async function commentRoutes(app: FastifyInstance) {
	app.get('/comments/:articleId', listComments);

	app.post('/comments', { onRequest: verifyJWT }, create);
	app.patch('/comments/:id', { onRequest: verifyJWT }, updateComment);
	app.delete('/comments/:commentId', { onRequest: verifyJWT }, removeComment);
}
