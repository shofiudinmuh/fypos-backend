import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantProfileDto {
    @ApiProperty({
        description: 'Business Name',
        example: 'FyPOS Retail',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Business Phone Number',
        example: '08123456789',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        description: 'Business Address',
        example: 'Jalan Raya No. 1, Jakarta',
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'Business Type',
        example: 'Retail / F&B',
        required: false,
    })
    @IsString()
    @IsOptional()
    businessType?: string;
}
