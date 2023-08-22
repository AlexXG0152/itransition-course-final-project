import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT, () => {
    console.log(`Server started on port:${PORT}`);
  });
}
bootstrap();
