import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIngredientDto {
    @ApiProperty({
        description: 'Name of the ingredient',
        example: 'Sugar',
    })
    @IsString()
    @IsNotEmpty()
    ingredient_name!: string;

    @ApiProperty({
        description: 'Unit of measurement',
        example: 'kg',
    })
    @IsString()
    @IsNotEmpty()
    unit!: string;

    @ApiPropertyOptional({
        description: 'Minimum stock alert level',
        example: 5,
        default: 0,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    minimum_stock?: number;
}
