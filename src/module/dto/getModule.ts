import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StepDto } from 'src/Enrollment/dto/enrollment.dto';

export class Module {
  @ApiProperty({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' })
  @IsString()
  id!: string;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;

  @ApiProperty({ example: 'Введение в TypeScript' })
  @IsString()
  title!: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Основные концепции и типизация',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' })
  @IsString()
  courseId!: string;

  @ApiProperty({ type: StepDto, isArray: true, required: false })
  @IsOptional()
  step?: StepDto[];
}
