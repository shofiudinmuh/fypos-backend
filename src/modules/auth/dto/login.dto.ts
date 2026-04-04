import { IsString, IsNotEmpty, IsOptional, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email for Owner or Manager',
        example: 'owner@example.com',
        required: false,
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @ApiProperty({
        description: 'Password field must be at least 8 characters',
        example: '12345678',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({
        description: 'PIN for Cashier authentication',
        example: '1234',
        required: false,
    })
    @IsString()
    @IsOptional()
    pin?: string;

    @ApiProperty({
        description: 'Outlet Code for Manager or Cashier authentication',
        example: 'OUTLET-A',
    })
    @IsString()
    @IsOptional()
    outlet_id: string;

    @ApiProperty({
        description: 'Device Information for session tracking',
        example: 'iPhone 13 - Safari',
        required: false,
    })
    @IsString()
    @IsOptional()
    device_info?: string;
}
