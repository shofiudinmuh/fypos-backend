import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetAuditLogsQueryDto extends PaginationDto {
    @ApiProperty({
        required: false,
        description: 'Filter based on system entity (e.g., Tenant, Outlet, User)',
        example: 'User',
    })
    @IsOptional()
    @IsString()
    entity?: string;

    @ApiProperty({
        required: false,
        description: 'Filter based on action (CREATE, UPDATE, DELETE)',
        example: 'UPDATE',
    })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiProperty({
        required: false,
        description: 'Filter based on outlet ID',
        example: 'outlet-cuid-123',
    })
    @IsOptional()
    @IsString()
    outlet_id?: string;

    @ApiProperty({
        required: false,
        description: 'Filter starting from date',
        example: '2024-01-01',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({
        required: false,
        description: 'Filter up to date',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
