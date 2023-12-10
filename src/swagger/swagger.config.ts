import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfig(app: INestApplication): void{
    const config = new DocumentBuilder()
    .setTitle('Foodie API')
    .setDescription('API for meal ordering system')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Restaurant')
    .addTag('Bookmarks')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
}