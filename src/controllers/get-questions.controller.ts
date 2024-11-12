import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
@UsePipes(new ZodValidationPipe(pageQueryParamSchema))
export class GetQuestionsController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async handle(@Query('page') page: PageQueryParamSchema) {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      questions,
    }
  }
}
