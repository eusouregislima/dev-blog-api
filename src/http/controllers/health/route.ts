import type { FastifyInstance } from 'fastify';
import { healthController } from './health';

export async function healthRoutes(app: FastifyInstance) {
	app.get('/', healthController);
}
