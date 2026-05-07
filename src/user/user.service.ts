import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  getByEmailNoPromise(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async postAproveUser(id: string) {
    const user = await this.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id: id },
      data: { isAproved: true },
    });
  }

  async createUser(data: CreateUserDto) {
    const user: User = {
      email: data.email,
      name: '',
      password: await hash(data.password),
      role: 'User',
      isAproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: randomUUID(),
    };
    return this.prisma.user.create({ data: user });
  }
}
