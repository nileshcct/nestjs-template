import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request } from 'express';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}


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

   @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(refreshToken);
  }
  // @Post('logout')
  // @HttpCode(204)
  // async logout(@Req() req: any): Promise<{ message: string }> {
  //   const sessionId = req.user.sid
  //   await this.authService.logout(sessionId); // Optional: blacklist jti if needed
  //   return { message: 'Logged out successfully' };
  // }
}
