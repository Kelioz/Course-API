import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/createBook.dto';
import { BookDTO } from './dto/Book.dto';
import { BooksDTO } from './dto/Books.dto';
import { randomUUID } from 'crypto';
import { Roles } from 'src/auth/decorators/role-decorator';
import { AppRole } from 'src/auth/decorators/current-user.decorator';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(): Promise<BooksDTO> {
    return this.prisma.book.findMany({ orderBy: { createdAt: 'asc' } });
  }
  async getBook(id: string): Promise<BookDTO> {
    const book = await this.prisma.book.findFirst({ where: { id: id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }
  async putBook(id: string, data: CreateBookDto): Promise<BookDTO> {
    const book = await this.prisma.book.update({
      where: { id: id },
      data: { description: data.description, title: data.title },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }
  async createBook(dto: CreateBookDto): Promise<BookDTO> {
    return this.prisma.book.create({
      data: {
        ...dto,
        id: randomUUID(),
      },
    });
  }
  async deleteBook(id: string) {
    const existingBook = await this.prisma.book.findUnique({
      where: { id: id },
    });

    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const book = await this.prisma.book.delete({
      where: { id: id },
    });

    return {
      message: `Книга удалена c id ${book.id}`,
      id: book.id,
      statusCode: 204,
    };
  }
}
