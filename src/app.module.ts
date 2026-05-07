import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [ConfigModule.forRoot(), BookModule, AuthModule, UserModule],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
