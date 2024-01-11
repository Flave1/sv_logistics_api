"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModule = void 0;
const common_1 = require("@nestjs/common");
const restaurant_service_1 = require("./restaurant.service");
const restaurant_controller_1 = require("./restaurant.controller");
const platform_express_1 = require("@nestjs/platform-express");
const menu_module_1 = require("./menu/menu.module");
const gateway_service_1 = require("../gateway/gateway.service");
const menu_service_1 = require("./menu/menu.service");
const customer_module_1 = require("./customer/customer.module");
const country_module_1 = require("./country/country.module");
const client_module_1 = require("./client/client.module");
let RestaurantModule = class RestaurantModule {
};
exports.RestaurantModule = RestaurantModule;
exports.RestaurantModule = RestaurantModule = __decorate([
    (0, common_1.Module)({
        providers: [
            restaurant_service_1.RestaurantService,
            gateway_service_1.GatewayService,
            menu_service_1.MenuService
        ],
        imports: [
            platform_express_1.MulterModule.register({ dest: '../uploads/menu-category' }),
            platform_express_1.MulterModule.register({ dest: '../uploads/menu-subcategory' }),
            platform_express_1.MulterModule.register({ dest: '../uploads/menu' }),
            menu_module_1.MenuModule,
            customer_module_1.CustomerModule,
            country_module_1.CountryModule,
            client_module_1.ClientModule
        ],
        controllers: [restaurant_controller_1.RestaurantController],
    })
], RestaurantModule);
//# sourceMappingURL=restaurant.module.js.map