import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum StepTypeEnum {
  Text = 'Text',
  Video = 'Video',
  Quiz = 'Quiz',
  Task = 'Task',
}

export class GetStepDto {
  @ApiProperty({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' })
  @IsString()
  id!: string;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;

  @ApiProperty({ example: 'Основные типы данных' })
  @IsString()
  title!: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Изучение string, number, boolean...',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ enum: StepTypeEnum, example: StepTypeEnum.Text })
  @IsEnum(StepTypeEnum)
  type!: StepTypeEnum;

  @ApiProperty({ example: 0 })
  @IsInt()
  order!: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiProperty({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' })
  @IsString()
  moduleId!: string;
}
