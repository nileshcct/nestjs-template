import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request } from 'express';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ResendAuthDto } from './dto/resend-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
): Promise<any> {
    return this.authService.login(loginDto, {
      ip: req.ip ?? req.socket?.remoteAddress ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    });
  }
   @Public()
   @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(refreshToken);
  }
  @Public()
  @Post('verify')
  async verify(@Body() dto: VerifyAuthDto) {
    await this.authService.verify(dto);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(@Body() dto: ResendAuthDto) {
    await this.authService.resendVerification(dto);
  }

  // PROTECTED ONLY ROUTE
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: any): Promise<{ message: string }> {
    const sessionId = req.user.sid;
    await this.authService.logout(sessionId); // Optional: blacklist jti if needed
    return { message: 'Logged out successfully' };
  }
}
