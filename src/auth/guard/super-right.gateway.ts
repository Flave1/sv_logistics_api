import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
import { AuthPayload, SocketWithAuth } from 'src/gateway/dto';
import { UserService } from 'src/restaurant/user/user.service';
  
  @Injectable()
  export class GatewayAdminGuard implements CanActivate {
    private readonly logger = new Logger(GatewayAdminGuard.name);
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // regular `Socket` from socket.io is probably sufficient
      const socket: SocketWithAuth = context.switchToWs().getClient();
  
      // for testing support, fallback to token header
      const token =
        socket.handshake.auth.token || socket.handshake.headers['token'];
  
      if (!token) {
        this.logger.error('No authorization token provided');
  
        throw new ForbiddenException('No token provided');
      }
  
      try {
        const payload = this.jwtService.verify<AuthPayload & { sub: string }>(
          token,
        );
  
        this.logger.debug(`Validating admin using token payload`, payload);
  
        const { sub } = payload;
  
        const admin = await this.userService.getSuperUser();
  
        if (sub !== admin.admin) {
          throw new ForbiddenException('Admin privileges required');
        }
  
        return true;
      } catch {
        throw new ForbiddenException('Admin privileges required');
      }
    }
  }