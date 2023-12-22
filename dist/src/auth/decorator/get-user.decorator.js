"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateGatewayUser = exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = ctx.switchToHttp().getRequest();
    if (data) {
        return request.user[data];
    }
    const token = authorization.headers.authorization.toString().replace('Bearer ', '');
    const info = request.user;
    info.idToken = token;
    info.expireDate = getExpireDate(token);
    info.registered = true;
    info.expiresIn = getExpiresIn(token);
    info.displayName = '';
    info.localId = '';
    return info;
});
function getExpireDate(token) {
    try {
        const decodedToken = jwt.decode(token, { complete: true });
        if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
            const expireDate = new Date(decodedToken.payload.exp * 1000);
            return expireDate;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
function getExpiresIn(token) {
    try {
        const decodedToken = jwt.decode(token, { complete: true });
        if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const expiresIn = decodedToken.payload.exp - currentTimestamp;
            return expiresIn;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
exports.ValidateGatewayUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = ctx.switchToHttp().getRequest();
    if (data) {
        return request.user[data];
    }
    return authorization.handshake.headers.token;
});
//# sourceMappingURL=get-user.decorator.js.map