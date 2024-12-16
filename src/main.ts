import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pinoHttp } from 'pino-http';
import pino from 'pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3000;

  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  app.use(pinoHttp({ logger }));

  await app.listen(port, () => {
    console.log(`🚀 Server ready at: http://localhost:${port}`);
  });
}
bootstrap();
