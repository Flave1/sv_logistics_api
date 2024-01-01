"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditRestaurantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EditRestaurantDto {
}
exports.EditRestaurantDto = EditRestaurantDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "openingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "closingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Boolean)
], EditRestaurantDto.prototype, "hasFreeDelivery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditRestaurantDto.prototype, "freeDeliveryAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Boolean)
], EditRestaurantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], EditRestaurantDto.prototype, "file", void 0);
//# sourceMappingURL=edit-restuarant.dto.js.map