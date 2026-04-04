import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        description: 'The unique reset token provided to the user via email/console',
        example: 'reset-token-123456',
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        description: 'New password for the account (minimum 8 characters)',
        example: 'NewSecurePassword123!',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}
