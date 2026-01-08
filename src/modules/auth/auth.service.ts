import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { RegisterDto } from './dto/register.dto';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.usecase';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
  ) {}

  async login(dto: LoginDto, meta: { ip: string; userAgent: string }): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto.email, dto.password, meta);
  }

  async register(registerDto : RegisterDto) {
    return this.registerUseCase.execute(registerDto);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: any }> {
    return this.refreshTokenUseCase.execute(refreshToken);
  }
  async verify(dto: VerifyAuthDto): Promise<any> {
    return this.verifyOtpUseCase.execute(dto);
  }
  async logout(sessionId: string): Promise<void> {
    await this.logoutUseCase.execute(sessionId);
  }
}
