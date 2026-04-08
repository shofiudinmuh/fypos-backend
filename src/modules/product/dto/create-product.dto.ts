import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product Category ID',
        example: 'cli123abc0001zxcd',
    })
    @IsString()
    @IsNotEmpty()
    product_category_id!: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Es Teh Manis',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({
        description: 'Stock Keeping Unit (SKU)',
        example: 'DRK-TM-01',
    })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiPropertyOptional({
        description: 'Product description',
        example: 'Classic sweet ice tea.',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product price',
        example: 5000,
    })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @ApiPropertyOptional({
        description: 'URL of the product image. Expected as a file upload via multipart/form-data.',
        type: 'string',
        format: 'binary',
    })
    @IsOptional()
    image_url?: string | any;

    @ApiPropertyOptional({
        description: 'Is product active',
        example: true,
        default: true,
    })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
