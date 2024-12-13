import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';
import { updateUserDescription } from './update-user-description';

export async function userRoutes(app: FastifyInstance) {
	app.post('/users', create);
	app.put(
		'/users/description',
		{ onRequest: verifyJWT },
		updateUserDescription,
	);
}
