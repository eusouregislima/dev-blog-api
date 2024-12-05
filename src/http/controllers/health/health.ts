import type { FastifyReply, FastifyRequest } from 'fastify';
import packageJson from '../../../../package.json';

export async function healthController(_: FastifyRequest, reply: FastifyReply) {
	const { name, description, version } = packageJson;
	return reply.status(200).send({
		message: `Project: ${name}, description: ${description}, and version: ${version}`,
	});
}
