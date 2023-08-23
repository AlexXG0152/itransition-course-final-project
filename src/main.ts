import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Recommendation Portal')
    .setDescription('The recommendation portal API description')
    .setVersion('1.0.0')
    .addTag('Recommendation Portal API')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/v1/docs', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT, () => {
    console.log(`Server started on port:${PORT}`);
  });
}
bootstrap();
