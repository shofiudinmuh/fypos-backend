import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RequestPasswordResetDto } from '../dto/request-password-reset.dto';
import * as crypto from 'crypto';

@Injectable()
export class RequestPasswordResetUseCase {
    constructor(private prisma: PrismaService) {}

    async execute(dto: RequestPasswordResetDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email, deleted_at: null },
            });

            if (!user) {
                // For security, don't reveal if email exists. Just return success.
                return {
                    success: true,
                    message: 'If the email exists in our system, you will receive a reset link shortly.',
                };
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

            await this.prisma.passwordResetToken.create({
                data: {
                    user_id: user.user_id,
                    token: resetToken,
                    expires_at: expiresAt,
                },
            });

            // MOCK EMAIL SENDER
            console.log('----------------------------------------------------');
            console.log(`[EMAIL MOCK] To: ${dto.email}`);
            console.log(`[EMAIL MOCK] Subject: Password Reset Request`);
            console.log(`[EMAIL MOCK] Token: ${resetToken}`);
            console.log(`[EMAIL MOCK] Link: http://localhost:3000/auth/reset?token=${resetToken}`);
            console.log('----------------------------------------------------');

            return {
                success: true,
                message: 'If the email exists in our system, you will receive a reset link shortly.',
            };
        } catch (error) {
            console.error('[RequestPasswordResetUseCase]: ', error);
            throw new InternalServerErrorException('Failed to process password reset request');
        }
    }
}
