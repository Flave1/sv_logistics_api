import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger/swagger.config';
import { ValidationExceptionFilter } from './exceptions/ValidationExceptionFilter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  swaggerConfig(app);

  app.enableCors();
  
   const imagePath = join(__dirname).replace("/dist", "").replace("/src", "");
   app.useStaticAssets(imagePath, { prefix: '/' });
 

  await app.listen(3200);//process.env['PORT']
}
bootstrap();