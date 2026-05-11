import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ApiResponse, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @Auth()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ operationId: 'createUser' })
  async createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('approve/:id')
  @Auth()
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ operationId: 'approveUser' })
  async postApproveUser(@Param('id') id: string) {
    return this.userService.postAproveUser(id);
  }

  @Get('all/users')
  @Auth()
  @ApiOperation({ operationId: 'getUserById' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('profile')
  @Auth()
  @ApiResponse({ type: Promise<User> })
  @ApiOperation({ operationId: 'getProfile' })
  async getProfile(@CurrentUser('id') id: string) {
    const user = await this.userService.getById(id);
    return user;
  }

  @Get(':email')
  @Auth()
  @ApiOperation({ operationId: 'getUserByEmail' })
  @ApiParam({ name: 'email', type: String })
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getByEmail(email);
  }
}
