import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
    @ApiProperty({
        description: 'Email address of the user who needs to reset their password',
        example: 'john@test.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
