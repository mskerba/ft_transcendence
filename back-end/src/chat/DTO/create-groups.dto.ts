import { IsOptional, IsIn, IsNumber, IsString, IsStrongPassword, ValidateIf, IsNotEmpty, isDate, isDataURI, IsDataURI, MIN_LENGTH, MinLength, MaxLength } from "class-validator";

export class CreateGroupDto{

   @IsNumber()
   UserId: number;

   @IsIn(['public', 'protected', 'private'])
   TypeRoom: string;

   @IsOptional()
   avatar?: string;
   
   @MinLength(5)
   @MaxLength(30)
   @IsString()
   title: string;

   
   // i will validate here 
   @IsOptional()
   @IsNotEmpty()
   @IsStrongPassword()
   password: string
}

export class CreateRoleUserDto{

   @IsNumber()
   userId: number;

   @IsString()
   @IsNotEmpty()
   roomId: string;

   @IsIn(['admin', 'member'])
   roleName: string;

}

export class PunishDto{

   @IsNotEmpty()
   @IsString()
   roomId: string;

   @IsNotEmpty()
   @IsNumber()
   senderId: number;


   @IsNotEmpty()
   @IsNumber()
   userId: number;

}

export class MuteDto extends PunishDto{

   @IsNotEmpty()
   @IsNumber()
   numberHour: number;
   
}
