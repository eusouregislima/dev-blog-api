import fastify from 'fastify';
import { ZodError } from 'zod';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/app-error';
import { healthRoutes } from './controllers/health/route';
import { userRoutes } from './controllers/users/route';

export const app = fastify();

app.register(healthRoutes);
app.register(userRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error', issues: error.format() });
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({ message: error.message });
	}

	return reply.status(500).send({ message: 'Internal server error.' });
});

app
	.listen({
		host: '0.0.0.0',
		port: 4000,
	})
	.then(() => {
		console.log('🚀 Server is running at port 4000...');
	});

process.on('SIGINT', async () => {
	await prisma.$disconnect();
	console.log('Prisma disconnected');
	process.exit(0);
});
