import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegisterDto {
    @ApiProperty({
        description: 'Register Name',
        example: 'Main Cashier',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: 'Register code',
        example: 'REG-01',
    })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiProperty({
        description: 'Is register active',
        example: true,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    is_actvie?: boolean;
}
