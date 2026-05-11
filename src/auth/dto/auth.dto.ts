import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, MinLength } from 'class-validator';
import { AppRole } from '../decorators/current-user.decorator';
export class AuthDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
  @ApiProperty()
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов',
  })
  @ApiProperty()
  @IsString()
  password!: string;
}
export class User {
  @ApiProperty()
  name!: string | null;
  @ApiProperty()
  id!: string;
  @ApiProperty()
  createdAt!: Date | null;
  @ApiProperty()
  updatedAt!: Date | null;
  @ApiProperty()
  email!: string;
  @ApiProperty()
  password!: string;
  @ApiProperty()
  isAproved!: boolean;
  @ApiProperty({ enum: AppRole, enumName: 'AppRole' })
  role!: AppRole;
}
export class AuthResponeDto {
  @ApiProperty()
  user!: User;

  @ApiProperty()
  accessToken!: string;
}
