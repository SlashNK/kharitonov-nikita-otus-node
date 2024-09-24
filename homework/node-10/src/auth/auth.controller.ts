import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/shared/entities/user.entity';
import { Response } from 'express'; // Import Response from express

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    if (!username || !email || !password) {
      throw new BadRequestException(
        'Username, Email, and Password are required',
      );
    }
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      throw new UnauthorizedException('Username and Password are required');
    }
    return this.authService.login(username, password);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }, @Res() res: Response) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.logout(refreshToken);
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(204).send();
  }
}
