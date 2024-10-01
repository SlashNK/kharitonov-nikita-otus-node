import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { saltPassword } from './shared/utils';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './shared/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, email, password } = registerDto;
    const userExists = (await this.userService.findAll()).find(
      (user) => user.email === email || user.username === username,
    );
    if (userExists) {
      throw new ConflictException('Username or Email already exists');
    }
    const hashedPassword = await saltPassword(password);

    try {
      const newUser = await this.userService.create({
        username,
        email,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(username: string, password: string): Promise<any> {
    const user = (await this.userService.findAll()).find(
      (user) => user.username === username,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    await this.userService.update(user.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const user = (await this.userService.findAll()).find(
      (user) => user.refreshToken === refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign(
        {
          username: payload.username,
          email: payload.email,
          role: payload.role,
        },
        { expiresIn: '30s' },
      );
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const user = (await this.userService.findAll()).find(
      (user) => user.refreshToken === refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.userService.update(user.id, { refreshToken: null });
  }
}
