import { Get, Controller, UseGuards, Req, Res, Post, Body, HttpCode } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginUseCase } from './application/login.usecase';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private loginUseCase: LoginUseCase,
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
}
