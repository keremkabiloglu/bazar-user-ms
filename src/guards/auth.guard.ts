import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PERMISSONS_KEY } from 'src/decorators/permission.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { JWTPayload } from 'src/util/model/jwt.payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      const natsCredentials = this.getNatsCredentials(context);
      if (natsCredentials === this.configService.get('NATS_CREDENTIAL')) {
        return true;
      }
      throw new UnauthorizedException();
    }

    const payload = (await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    })) as JWTPayload;
    request['user'] = payload;
    const permissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (permissions) {
      const entity = context
        .getClass()
        .name.replace('Controller', '')
        .toLowerCase();
      const userPermissions = payload.permissions;
      const hasPermission = permissions.some((permission) => {
        return userPermissions.some((p) => {
          return p[entity]?.map((perm) => `${perm}`)?.includes(permission);
        });
      });
      if (!hasPermission) {
        throw new ForbiddenException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const cookies = request.headers?.cookie?.split('; ');
    const token = cookies
      ?.find((cookie) => cookie.startsWith('Authentication'))
      ?.split('=')[1];
    if (token) {
      return decodeURIComponent(token).split(' ')[1];
    }

    return undefined;
  }

  private getNatsCredentials(context: ExecutionContext): string {
    const args = context.switchToRpc().getContext().args;
    if (args && Array.isArray(args) && args.length > 1) {
      return args[1].headers.get('nats-credential');
    }
    return null;
  }
}
