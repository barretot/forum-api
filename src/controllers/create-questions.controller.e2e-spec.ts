import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { argon2id, hash } from 'argon2'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Create questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hash('passwordTest123', {
          type: argon2id,
          timeCost: 8,
        }),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Question content',
      })

    const questionOnDataBase = await prisma.question.findFirst({
      where: {
        title: 'New Question',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(questionOnDataBase).toBeTruthy()
  })
})
