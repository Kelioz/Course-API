import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class BookDTO {
  @ApiProperty()
  @IsUUID(4)
  id: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsOptional()
  description: string | undefined | null;
}
