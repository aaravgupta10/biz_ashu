import Fastify from 'fastify';
import { PLATFORM_VERSION } from '@platform/shared';
import { ImmutableCognitiveState } from '@platform/core';
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
  const dummyState = ImmutableCognitiveState.create({
    id: 'state-uuid-example',
    personaId: 'persona-uuid-example',
    activeGoal: 'Complete Sign-up',
    frustrationLevel: 0.2,
    trustLevel: 0.8,
  });

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
