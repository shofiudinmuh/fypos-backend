import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthUseCase } from '../application/google-auth.usecase';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private readonly logger = new Logger(GoogleStrategy.name);
    constructor(
        config: ConfigService,
        private googleAuthUseCase: GoogleAuthUseCase,
    ) {
        super({
            clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const { id: googleId, emails, displayName } = profile;
            const email = emails[0].value;

            if (!email) {
                return done(new Error('No email found from Google profile'), false);
            }

            const result = await this.googleAuthUseCase.execute({
                googleId,
                email,
                name: displayName,
            });

            done(null, result);
        } catch (error) {
            this.logger.error(`Google validation error: ${error.message}`, error.stack);
            return done(error, false);
        }
    }
}
