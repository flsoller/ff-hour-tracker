import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow cors in dev mode
  app.enableCors({ origin: 'http://localhost:4200' });

  // Define server port
  const PORT = process.env.PORT || 5000;

  await app.listen(PORT);
}
bootstrap();
