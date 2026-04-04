import { Get, Controller, UseGuards, Req, Res, Post, Body, HttpCode } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginUseCase } from './application/login.usecase';
import { RequestPasswordResetUseCase } from './application/request-password-reset.usecase';
import { ResetPasswordUseCase } from './application/reset-password.usecase';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private loginUseCase: LoginUseCase,
        private requestPasswordResetUseCase: RequestPasswordResetUseCase,
        private resetPasswordUseCase: ResetPasswordUseCase,
        private configService: ConfigService,
    ) {}

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'User authentication' })
    @ApiResponse({ status: 200, description: 'Authentication successfully, return token' })
    async login(@Body() dto: LoginDto) {
        return this.loginUseCase.execute(dto);
    }

    // redirect google
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        //passport will handle redirect automatically
    }

    // callback from google
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req: any, @Res() res: any) {
        const result = req.user; //from google strategy

        const frontedUrl = this.configService.get('FRONTEND_URL');

        res.redirect(
            `${frontedUrl}/auth/callback?token=${result.access_token}&tenant_id=${result.tenant_id}`,
        );
    }

    @Post('password-reset/request')
    @HttpCode(200)
    @ApiOperation({ summary: 'Request password reset token' })
    @ApiResponse({ status: 200, description: 'Token generated and logged/sent' })
    async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
        return this.requestPasswordResetUseCase.execute(dto);
    }

    @Post('password-reset/reset')
    @HttpCode(200)
    @ApiOperation({ summary: 'Reset password using token' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.resetPasswordUseCase.execute(dto);
    }
}
