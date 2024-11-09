import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  async onModuleInit() {
    const poolConnect = await this.$connect()

    return poolConnect
  }

  async onModuleDestroy() {
    const poolDisconnect = await this.$disconnect()

    return poolDisconnect
  }
}
