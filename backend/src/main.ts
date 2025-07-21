import 'dotenv/config'; // Carga las variables de entorno al iniciar
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`🚀 API running at http://localhost:${PORT}`);
}

bootstrap();
