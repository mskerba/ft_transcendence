import {
    IsString,
    IsNotEmpty,
    Length,
    IsEmail,
    IsOptional,
    IsBoolean,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    name: string;


    @IsEmail()
    @IsString()
    @IsNotEmpty() 
    email: string;


    @IsOptional()
    @IsString()
    avatar: string;


    @IsString()
    @IsNotEmpty()
    provider: string;


    @IsString()
    @IsNotEmpty()
    provider_id: string;

    @IsString()
    @IsOptional()
    hashed_rt: string

    @IsBoolean()
    @IsOptional()
    is_2fa_enabled: boolean;

    @IsString()
    @IsOptional()
    two_fa_secret_key: string;

    @IsBoolean()
    @IsOptional()
    is_two_factor_verified: boolean;
}
