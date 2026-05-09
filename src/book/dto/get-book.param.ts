import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetBooksParams {
  @ApiProperty({
    description: 'ID книги',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;
}

export class GetAllBooksQuery {
  @ApiProperty({
    description: 'Название книги',
    required: false,
    example: 'кНига',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.trim())
  title?: string;
}
