import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOutletDto {
    @ApiProperty({
        required: false,
        example: 'Grand Sudirman Branch',
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        required: false,
        example: 'Jl. Jend Sudirman Kav 22, Jakarta',
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    address?: string;

    @ApiProperty({
        required: false,
        example: '021-999-888',
    })
    @IsOptional()
    @IsNotEmpty()
    phone?: string;
}
