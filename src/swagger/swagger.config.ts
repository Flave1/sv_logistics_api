import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfig(app: INestApplication): void{
    const config = new DocumentBuilder()
    .setTitle('FOODIE CAFE API')
    .setDescription('API Documentation for foodie endpoints')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Restaurant')
    .addTag('Bookmarks')
    .addTag('Menu')
    .addTag('Address')
    .addTag('Web')
    .addTag('CustomerWeb')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      consumes: ['multipart/form-data']
    },
  });
}