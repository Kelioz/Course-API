import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateModuleBody {
  @ApiProperty({
    example: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
    description: 'ID курса (ULID)',
  })
  @IsString()
  courseId!: string;

  @ApiProperty({ example: 'Введение в TypeScript' })
  @IsString()
  title!: string;

  @ApiProperty({
    required: false,
    example: 'Основные концепции и типизация',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
