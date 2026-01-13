import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VerificationTokenType } from '../constants/auth-verification-token-type.enum';


export class ResendAuthDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsEnum(VerificationTokenType)
  type: VerificationTokenType;
}
