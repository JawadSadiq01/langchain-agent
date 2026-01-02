import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
