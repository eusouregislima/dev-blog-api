import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../errors/unauthorized-error';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify();
	} catch (error) {
		throw new UnauthorizedError('Unauthorized.');
	}
}
