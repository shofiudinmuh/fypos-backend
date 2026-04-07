import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductIngredientDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'prod123abc456def',
    })
    @IsString()
    @IsNotEmpty()
    product_id!: string;

    @ApiProperty({
        description: 'Ingredient ID',
        example: 'ing123abc456def',
    })
    @IsString()
    @IsNotEmpty()
    ingredient_id!: string;

    @ApiProperty({
        description: 'Quantity of ingredient',
        example: 5,
    })
    @IsInt()
    @Min(1)
    qty!: number;
}
