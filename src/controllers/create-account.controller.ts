import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash, argon2id } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prismaService: PrismaService) {}
  @Post()
  @HttpCode(201)
  async handle(@Body() body) {
    const { name, email, password } = body

    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email: email as string,
      },
    })

    if (userAlreadyExists) {
      throw new ConflictException('User exists')
    }

    const hashedPassword = await hash(password, {
      type: argon2id,
      timeCost: 8,
    });

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return user
  }
}
