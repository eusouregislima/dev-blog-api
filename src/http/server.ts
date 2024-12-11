import 'dotenv/config';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/app-error';
import { articlesRoutes } from './controllers/articles/route';
import { authRoutes } from './controllers/auth/route';
import { commentRoutes } from './controllers/comments/route';
import { healthRoutes } from './controllers/health/route';
import { userRoutes } from './controllers/users/route';

export const app = fastify();

app.register(fastifyJwt, {
	secret: String(process.env.JWT_SECRET),
	sign: {
		expiresIn: String(process.env.JWT_EXPIRATION),
	},
});

app.register(cors, {
	origin: true,
});

app.register(healthRoutes);
app.register(authRoutes);
app.register(userRoutes);
app.register(articlesRoutes);
app.register(commentRoutes);

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
