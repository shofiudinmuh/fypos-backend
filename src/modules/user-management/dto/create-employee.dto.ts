import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateEmployeeDto {
    @ApiProperty({
        description: 'Employee Full Name',
        example: 'Ahmad Staff',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: 'Employee Email Address',
        example: 'ahmad@fypos.id',
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        description: 'Login Password (for ADMIN role)',
        example: 'Password123!',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(8)
    password?: string;

    @ApiProperty({
        description: 'Login PIN (for CASHIER role)',
        example: '1234',
        required: false,
    })
    @IsString()
    @IsOptional()
    pin?: string;

    @ApiProperty({
        description: 'User Role (ADMIN or CASHIER)',
        enum: Role,
        example: Role.CASHIER,
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role!: Role;

    @ApiProperty({
        description: 'Target Outlet ID',
        example: 'outlet-cuid-123',
    })
    @IsString()
    @IsNotEmpty()
    outlet_id!: string;
}
