import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}
  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateQuestionBodySchema,
  ) {
    const { content, title } = body
    const { sub: userId } = user

    await this.prisma.question.create({
      data: {
        authorId: userId,
        content,
        title,
        slug: this.convertToSlug(title),
      },
    })

    return 'ok'
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
