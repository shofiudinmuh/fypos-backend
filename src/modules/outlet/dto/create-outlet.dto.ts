import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOutletDto {
    @ApiProperty({
        description: 'Name of the branch/outlet',
        example: 'Sudirman Branch',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: 'Complete address of the outlet',
        example: 'Jl. Jend Sudirman Kav 21, Jakarta',
    })
    @IsString()
    @IsNotEmpty()
    address!: string;

    @ApiProperty({
        description: 'Outlet contact phone number',
        example: '021-5551234',
    })
    @IsString()
    @IsNotEmpty()
    phone!: string;
}
