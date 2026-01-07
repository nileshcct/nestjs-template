import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VerificationTokenType } from '../constants/auth-verification-token-type.enum';


export class VerifyAuthDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsEnum(VerificationTokenType)
  type: VerificationTokenType;
}
