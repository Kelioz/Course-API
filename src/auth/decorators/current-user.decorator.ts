import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export enum AppRole {
  ADMIN = 'Admin',
  USER = 'User',
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: AppRole;
  };
}

export const CurrentUser = createParamDecorator(
  (data: keyof RequestWithUser['user'], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return data ? user[data] : user;
  },
);
