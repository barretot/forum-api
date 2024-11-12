import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { argon2id, hash } from 'argon2'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hash('passwordTest123', {
          type: argon2id,
          timeCost: 8,
        }),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@doe.com',
      password: 'passwordTest123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
