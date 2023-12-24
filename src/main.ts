import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger/swagger.config';
import { ValidationExceptionFilter } from './exceptions/ValidationExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ValidationExceptionFilter());

  swaggerConfig(app);

  app.enableCors();
  await app.listen(3200);//process.env['PORT']
}
bootstrap();