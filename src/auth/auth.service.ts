import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto, User } from './dto/auth.dto';
import { verify } from 'argon2';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}
  private async validateUser(data: AuthDto) {
    const user = await this.userService.getByEmail(data.email);
    if (!user) throw new NotFoundException('User not found');
    const isValid = await verify(user.password, data.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');
    return user;
  }
  private issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '7h' });

    return { accessToken, refreshToken };
  }

  async login(data: AuthDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.validateUser(data);
    const tokens = this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
  }
  async register(data: AuthDto) {
    const existUser = await this.userService.getByEmailNoPromise(data.email);

    if (existUser) throw new BadRequestException('User already exist');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.createUser(data);
    const tokens = this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }
  async getNewToken(refreshToken: string) {
    const result: User = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { ...user } = await this.userService.getById(result.id);

    const tokens = this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
