import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import * as YAML from 'yaml';

dotenv.config();

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Book API')
    .setDescription('The book API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    explorer: true,
    swaggerOptions: {
      showRequestDuration: true,
    },
  });
  app.use('/api-docs-yaml', (req, res: Response) => {
    res.header('Content-Type', 'application/x-yaml');
    res.send(YAML.stringify(document));
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
