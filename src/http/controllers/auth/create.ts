import { compare } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { app } from '../../server';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const authSchema = z.object({
		email: z.string().email(),
		password: z.string(),
	});

	const data = authSchema.parse(request.body);

	const { email, password } = data;

	const userExists = await prisma.user.findUnique({ where: { email } });

	if (!userExists) {
		throw new UnauthorizedError('Wrong credentials.');
	}

	const passwordMatches = await compare(password, String(userExists.password));

	if (!passwordMatches) {
		throw new UnauthorizedError('Wrong credentials.');
	}

	const token = app.jwt.sign({
		id: userExists.id,
	});

	return reply
		.status(201)
		.send({ token, userName: userExists.userName, email: userExists.email });
}
