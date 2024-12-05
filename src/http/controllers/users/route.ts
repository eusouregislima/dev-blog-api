import type { FastifyInstance } from 'fastify';
import { create } from './create';

export async function userRoutes(app: FastifyInstance) {
	app.post('/users', create);
}
