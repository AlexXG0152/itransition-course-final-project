import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AppModule } from './app.module';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    allowedHeaders: [
      'content-type',
      'authorization',
      'access-control-allow-origin',
      'access-control-allow-credentials',
    ],
    origin: [
      'http://localhost:4200',
      'https://itransition-course-final-project-front.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Recommendation Portal')
    .setDescription('The recommendation portal API description')
    .setVersion('1.0.0')
    .addTag('Recommendation Portal API')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/v1/docs', app, swaggerDocument);

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
  getStorage(initializeApp(firebaseConfig));

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT, () => {
    console.log(`Server started on port:${PORT}`);
  });
}
bootstrap();
