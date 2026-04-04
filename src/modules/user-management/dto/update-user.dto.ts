import { IsString, IsOptional, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateUserDto {
    @ApiProperty({
        required: false,
        example: 'Ahmad Updated Name',
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        required: false,
        example: 'newpassword123',
    })
    @IsString()
    @IsOptional()
    @MinLength(8)
    password?: string;

    @ApiProperty({
        required: false,
        example: '4321',
    })
    @IsString()
    @IsOptional()
    pin?: string;

    @ApiProperty({
        required: false,
        enum: Role,
        example: Role.ADMIN,
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiProperty({
        required: false,
        example: 'target-outlet-cuid',
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    outlet_id?: string;
}
