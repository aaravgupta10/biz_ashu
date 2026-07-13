import Fastify from 'fastify';
import { PLATFORM_VERSION } from '@platform/shared';
import { generateRecommendations } from '@platform/recommendation';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

fastify.get('/health', async () => {
  return {
    status: 'ok',
    version: PLATFORM_VERSION,
  };
});

fastify.get('/demo-recommendation', async () => {
  // Use duck typing to satisfy the parameter interface without direct import
  const dummyState = {
    id: 'state-uuid-example',
    traceId: 'trace-uuid-example',
    inferences: ['user hovered over hero image', 'user scroll speed decreased'],
    confidence: 0.88,
  };

  const recommendations = generateRecommendations(dummyState);
  return { recommendations };
});

const start = async () => {
  try {
    // Port 3001 is standard for Fastify API in a Next.js monorepo
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
