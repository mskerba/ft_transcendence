import {
    IsString,
    IsNotEmpty,
    Length,
    IsEmail,
    IsOptional
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
}
