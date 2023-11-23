import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsNumberString
} from 'class-validator';

export class TwoFATokenDto {
    @MinLength(6)
    @MaxLength(6)
    @IsString()
    @IsNotEmpty()
    @IsNumberString()
    token: string;
}
