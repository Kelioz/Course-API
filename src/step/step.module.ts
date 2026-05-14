import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StepController } from './step.controller';
import { StepService } from './step.service';

@Module({
  controllers: [StepController],
  providers: [StepService, PrismaService],
  exports: [StepService],
})
export class StepModule {}
