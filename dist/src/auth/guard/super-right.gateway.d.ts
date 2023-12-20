import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/restaurant/user/user.service';
export declare class GatewayAdminGuard implements CanActivate {
    private readonly userService;
    private readonly jwtService;
    private readonly logger;
    constructor(userService: UserService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
