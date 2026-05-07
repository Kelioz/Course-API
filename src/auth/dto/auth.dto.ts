import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов',
  })
  @ApiProperty()
  @IsString()
  password: string;
}
