import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

// import jwt from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  const authorization: any = ctx.switchToHttp().getRequest();
  if (data) {
    return request.user[data];
  }
  const token = authorization.headers.authorization.toString().replace('Bearer ', '');
  const info: any = request.user;
  info.idToken = token;
  info.expireDate = getExpireDate(token)
  info.registered = true
  info.expiresIn = getExpiresIn(token);
  info.displayName = ''
  info.localId = ''
  return info;
},
);

function getExpireDate(token: string): Date | null {
  try {
    const decodedToken: any = jwt.decode(token, { complete: true });

    if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
      // Convert the expiration timestamp to a JavaScript Date object
      const expireDate = new Date(decodedToken.payload.exp * 1000);
      return expireDate;
    } else {
      // Token doesn't have an expiration date
      return null;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

function getExpiresIn(token: string): number | null {
  try {
    const decodedToken: any = jwt.decode(token, { complete: true });

    if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expiresIn = decodedToken.payload.exp - currentTimestamp;
      return expiresIn;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const ValidateGatewayUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  const authorization: any = ctx.switchToHttp().getRequest();

  if (data) {
    return request.user[data];
  }

  return authorization.handshake.headers.token;
},
);