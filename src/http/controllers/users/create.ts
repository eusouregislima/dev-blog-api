import { hash } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../database/prisma';
import { BadRequestError } from '../../../errors/bad-request-error';
import { userService } from '../../services/userService';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const userSchema = z.object({
		userName: z
			.string()
			.min(3, 'Ops, o nome de usuário precisa ter no mínimo 3 caracteres.')
			.max(30, 'Ops, o nome de usuário pode ter no máximo 30 caracteres')
			.regex(/^\S+$/, 'Ops, o nome de usuário não pode conter espaços'),
		email: z.string().email(),
		password: z.string().min(8).max(50),
		description: z.string().max(255).optional(),
	});

	const data = userSchema.parse(request.body);

	const { userName, email, password, description } = data;

	const userNameAlreadyExists = await prisma.User.findUnique({
		where: { userName },
	});

	if (userNameAlreadyExists) {
		throw new BadRequestError('UserName already exists.');
	}

	const emailAlreadyExists = await prisma.user.findUnique({ where: { email } });

	if (emailAlreadyExists) {
		throw new BadRequestError('Email already exists.');
	}

	const passwordHash = await hash(password, 6);

	const createdUser = await userService.createUser({
		userName,
		email,
		password: passwordHash,
		description,
	});

	createdUser.password = undefined;

	return reply.status(201).send(createdUser);
}
