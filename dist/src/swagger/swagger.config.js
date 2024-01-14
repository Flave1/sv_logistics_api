"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
function swaggerConfig(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FOODIE CAFE API')
        .setDescription('API Documentation for foodie endpoints')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Users')
        .addTag('Restaurant')
        .addTag('Bookmarks')
        .addTag('Menu')
        .addTag('Customer')
        .addTag('Address')
        .addTag('Customerweb')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            consumes: ['multipart/form-data']
        },
    });
}
exports.swaggerConfig = swaggerConfig;
//# sourceMappingURL=swagger.config.js.map