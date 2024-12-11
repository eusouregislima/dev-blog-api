import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';
import { find } from './find';
import { findBySlug } from './find-by-slug';
import { list } from './list';
import { listMy } from './list-my';
import { remove } from './remove';
import { update } from './update';

export async function articlesRoutes(app: FastifyInstance) {
	app.get('/articles', list);
	app.get('/articles/:id', find);
	app.get('/articles/slug/:slug', findBySlug);

	app.post('/articles', { onRequest: verifyJWT }, create);
	app.get('/articles/my', { onRequest: verifyJWT }, listMy);
	app.delete('/articles/:id', { onRequest: verifyJWT }, remove);
	app.put('/articles/:id', { onRequest: verifyJWT }, update);
}
