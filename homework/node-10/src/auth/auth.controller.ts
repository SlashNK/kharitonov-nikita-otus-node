import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './shared/dto/register.dto';
import { LoginDto } from './shared/dto/login.dto';
import { RefreshTokenDto } from './shared/dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    if (!username || !email || !password) {
      throw new BadRequestException(
        'Username, Email, and Password are required',
      );
    }
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    if (!username || !password) {
      throw new UnauthorizedException('Username and Password are required');
    }
    return this.authService.login(username, password);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
    const { refreshToken } = refreshTokenDto;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.logout(refreshToken);
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(204).send();
  }
}
