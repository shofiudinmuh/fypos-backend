import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductVariantDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'prod123abc456def',
    })
    @IsString()
    @IsNotEmpty()
    product_id!: string;

    @ApiProperty({
        description: 'Variant name',
        example: 'Large',
    })
    @IsString()
    @IsNotEmpty()
    variant_name!: string;

    @ApiProperty({
        description: 'Variant description',
        example: 'Large size 500ml',
    })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiPropertyOptional({
        description: 'Is variant active',
        example: true,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
