import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        // Payload comes from jwtService.sign() in login/register usecases
        if (!payload.sub || !payload.tenant_id) {
            throw new UnauthorizedException();
        }
        
        return {
            user_id: payload.sub,
            tenant_id: payload.tenant_id,
            outlet_id: payload.outlet_id,
            role: payload.role,
        };
    }
}
