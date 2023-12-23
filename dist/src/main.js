"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_config_1 = require("./swagger/swagger.config");
const ValidationExceptionFilter_1 = require("./exceptions/ValidationExceptionFilter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new ValidationExceptionFilter_1.ValidationExceptionFilter());
    (0, swagger_config_1.swaggerConfig)(app);
    app.enableCors();
    await app.listen(3200);
}
bootstrap();
//# sourceMappingURL=main.js.map