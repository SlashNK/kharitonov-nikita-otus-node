import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './shared/dto/register.dto';
import { LoginDto } from './shared/dto/login.dto';
import { RefreshTokenDto } from './shared/dto/refresh-token.dto';
import { AuthTypeDto } from './shared/dto/auth-type.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => String)
  async status(): Promise<string> {
    return 'Auth module is working!';
  }
  @Mutation(() => Boolean || undefined)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
  ): Promise<boolean | null> {
    console.log('post');
    const { username, email, password } = registerDto;
    if (!username || !email || !password) {
      throw new BadRequestException(
        'Username, Email, and Password are required',
      );
    }
    await this.authService.register(registerDto);
    return true;
  }

  // Login mutation
  @Mutation(() => AuthTypeDto)
  async login(@Args('loginDto') loginDto: LoginDto) {
    const { username, password } = loginDto;
    if (!username || !password) {
      throw new UnauthorizedException('Username and Password are required');
    }
    return this.authService.login(username, password);
  }

  // Refresh token mutation
  @Mutation(() => AuthTypeDto)
  async refreshToken(
    @Args('refreshTokenDto') refreshTokenDto: RefreshTokenDto,
  ) {
    const { refreshToken } = refreshTokenDto;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  // Logout mutation
  @Mutation(() => Boolean)
  async logout(
    @Args('refreshTokenDto') refreshTokenDto: RefreshTokenDto,
  ): Promise<boolean> {
    const { refreshToken } = refreshTokenDto;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.logout(refreshToken);
    return true;
  }
}
