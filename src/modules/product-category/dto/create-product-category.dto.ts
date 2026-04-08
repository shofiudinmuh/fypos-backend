import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
    @ApiProperty({
        description: 'Product category name',
        example: 'Mocktail',
    })
    @IsString()
    @IsNotEmpty()
    category_name!: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Drink with sparkling soda',
    })
    @IsString()
    @IsOptional()
    description?: string;
}
