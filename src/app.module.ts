import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './Enrollment/enrollment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BookModule,
    AuthModule,
    UserModule,
    CourseModule,
    EnrollmentModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
