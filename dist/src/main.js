"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_config_1 = require("./swagger/swagger.config");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    (0, swagger_config_1.swaggerConfig)(app);
    app.enableCors();
    const imagePath = (0, path_1.join)(__dirname).replace("/dist", "").replace("/src", "");
    app.useStaticAssets(imagePath, { prefix: '/' });
    await app.listen(3200);
}
bootstrap();
//# sourceMappingURL=main.js.map