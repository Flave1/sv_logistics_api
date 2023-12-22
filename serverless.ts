import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { swaggerConfig } from './src/swagger/swagger.config';
import serverlessExpress from '@vendia/serverless-express';

import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  swaggerConfig(app);

  app.enableCors();
  await app.init();//app.listen(process.env['PORT']);

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};