import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductCategoryDto {
    @ApiProperty({
        description: 'Product category name',
        example: 'Mocktail',
    })
    @IsString()
    @IsOptional()
    category_name!: string;

    @ApiProperty({
        description: 'Category description',
        example: 'Drink with sparkling soda',
    })
    @IsString()
    @IsOptional()
    description?: string;
}
