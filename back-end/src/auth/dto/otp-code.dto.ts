import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsNumberString
} from 'class-validator';

export class OTPCodeDto {
    @MinLength(6)
    @MaxLength(6)
    @IsString()
    @IsNotEmpty()
    @IsNumberString()
    otp: string;
}
