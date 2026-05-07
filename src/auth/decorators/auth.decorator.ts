import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWtAuthGurad } from 'src/auth/guards/jwt.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(JWtAuthGurad), ApiBearerAuth());
};
