import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '#/app.module';
import { GlobalExceptionFilter } from '#common/filters/global-exception.filter';
import { HttpExceptionFilter } from '#common/filters/http-exception.filter';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    exposeHeadRoutes: true,
    logger: false,
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get('swagger');
  await app.register(helmet, {
    global: true,
  });
  await app.register(compress);
  await app.register(cors, {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(
    //
    new GlobalExceptionFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    }),
  );

  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addServer(swaggerConfig.server.url, swaggerConfig.server.description)
    .addTag('salons', 'Operations related to salons')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocumentBuilder);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
