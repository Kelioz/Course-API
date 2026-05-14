import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CourseModule } from 'src/course/course.module';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [CourseModule],
  controllers: [ModuleController],
  providers: [ModuleService, PrismaService],
  exports: [ModuleService],
})
export class ModuleModule {}
