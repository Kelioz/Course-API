import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';
import { BookDTO } from './dto/Book.dto';
import { BooksDTO } from './dto/Books.dto';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetBooksParams } from './dto/get-book.param';
import { Roles } from 'src/auth/decorators/role-decorator';
import { AppRole } from 'src/auth/decorators/current-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('book')
@UseGuards(RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiResponse({ type: BookDTO, isArray: true })
  async getAllBooks(): Promise<BooksDTO> {
    return this.bookService.getAllBooks();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID книги',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ type: BookDTO })
  async getBook(@Param() params: GetBooksParams): Promise<BookDTO> {
    return this.bookService.getBook(params.id);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID книги',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ type: BookDTO })
  async putBook(
    @Param() params: GetBooksParams,
    @Body() data: CreateBookDto,
  ): Promise<BookDTO> {
    return this.bookService.putBook(params.id, data);
  }

  @Post()
  @ApiResponse({ type: BookDTO })
  async createBook(@Body() dto: CreateBookDto): Promise<BookDTO> {
    return this.bookService.createBook(dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID книги',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Roles(AppRole.ADMIN)
  async deleteBook(@Param() params: GetBooksParams) {
    return this.bookService.deleteBook(params.id);
  }
}
