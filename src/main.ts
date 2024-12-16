import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pinoHttp } from 'pino-http';
import pino from 'pino';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origin = process.env.FRONTEND_URL || 'http://localhost:3001';

  app.enableCors({
    credentials: true,
    origin: origin,
  });

  app.use(cookieParser());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  app.use(pinoHttp({ logger }));

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server ready at: http://localhost:${port}`);
  });
}
bootstrap();
