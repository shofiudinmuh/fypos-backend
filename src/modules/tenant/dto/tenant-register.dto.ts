import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength } from 'class-validator';

export class TenantRegisterDto {
    @IsString() @IsNotEmpty() name!: string;
    @IsEmail() ownerEmail!: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsString() address?: string;
    @IsOptional() @IsString() businessType?: string;

    // dto for user password
    @IsOptional() @IsString() @MinLength(8) password!: string;
}
