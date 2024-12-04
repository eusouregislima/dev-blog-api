import fastify from 'fastify';

export const app = fastify();

app.get('/', (request, reply) => {
	return reply
		.status(200)
		.send({ message: 'Agora eu nunca mais vou esquecer isso.' });
});

app
	.listen({
		host: '0.0.0.0',
		port: 4000,
	})
	.then(() => {
		console.log('🚀 Server is running at port 4000...');
	});
