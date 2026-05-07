import { AuthGuard } from '@nestjs/passport';
export class JWtAuthGurad extends AuthGuard('jwt') {}
