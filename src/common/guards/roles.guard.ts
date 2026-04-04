import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requireRoles) return true;

        const { user } = context.switchToHttp().getRequest();
        if (!requireRoles.some((role) => user?.role?.includes(role))) {
            throw new ForbiddenException('Access denied!');
        }
        return true;
    }
}
