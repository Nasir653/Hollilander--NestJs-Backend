// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// Import fastify-multipart with workaround for missing types
// @ts-ignore
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // Register fastify-multipart for file uploads
  // @ts-ignore
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // remove non-whitelisted properties
  //     forbidNonWhitelisted: true, // throw error if non-whitelisted properties exist
  //     //transform: true, // auto-transform payloads to DTO instances
  //   })
  // );

  const config = new DocumentBuilder()
    .setTitle('Hollilander API DOCS')
    .setDescription('All APIs of Hollilander')
    .setVersion('1.0')
    .addBearerAuth() // Optional: if you use JWT/auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.register(fastifyMultipart);

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
