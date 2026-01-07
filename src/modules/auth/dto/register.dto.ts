import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// email, password used only for auth module all other fields (name, age) is used for user module
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  age: number;

}
