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
    @Length(4, 32)
    name: string;


    @IsEmail()
    @IsString()
    @IsNotEmpty() 
    email: string;


    @IsOptional()
    @IsString()
    avatar: string;

    @IsString()
    @IsOptional()
    hashedRt: string

    @IsBoolean()
    @IsOptional()
    twoFA_Enabled: boolean;

    @IsString()
    @IsOptional()
    twoFA_SecretKey: string;

    @IsBoolean()
    @IsOptional()
    twoFA_Verified: boolean;
}
