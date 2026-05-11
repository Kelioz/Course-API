import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, User } from './dto/auth.dto';
import { type Request, type Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(200)
  @Post('login')
  @ApiResponse({ type: User })
  @ApiOperation({ operationId: 'login' })
  async login(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getByEmail(data.email);
    if (user.isAproved)
      throw new HttpException('Аккаунт не активирован администратором ', 403);
    const { refreshToken, ...response } = await this.authService.login(data);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('register')
  @ApiResponse({ type: User })
  @ApiOperation({ operationId: 'register' })
  async register(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(data);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @Post('login/access-token')
  @ApiResponse({ type: User })
  @ApiOperation({
    operationId: 'getNewToken',
    description: 'Получение нового токена при устаривании прошлого',
  })
  @ApiOperation({ operationId: 'logout' })
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies = req.cookies[
      this.authService.REFRESH_TOKEN_NAME
    ] as string;
    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenToResponse(res);
      throw new UnauthorizedException('Refresh token not found');
    }
    const { refreshToken, ...response } = await this.authService.getNewToken(
      refreshTokenFromCookies,
    );
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenToResponse(res);

    return { message: 'Выход успешен' };
  }
}
