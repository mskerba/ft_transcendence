import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsNumberString
} from 'class-validator';

export class OTPCodeDto {
    @MinLength(4)
    @MaxLength(4)
    @IsNumberString()
    otp: string;
}
