import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum StepTypeEnum {
  Text = 'Text',
  Video = 'Video',
  Quiz = 'Quiz',
  Task = 'Task',
}

export class UpdateStepBody {
  @ApiProperty({ example: 'Основные типы данных' })
  @IsString()
  title!: string;

  @ApiProperty({
    required: false,
    example: 'Изучение string, number, boolean...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: StepTypeEnum, example: StepTypeEnum.Text })
  @IsEnum(StepTypeEnum)
  type!: StepTypeEnum;

  @ApiProperty({ example: 0, description: 'Порядок шага в модуле' })
  @IsInt()
  order!: number;

  @ApiProperty({ required: false, example: 'Содержимое шага...' })
  @IsOptional()
  @IsString()
  content?: string;
}
