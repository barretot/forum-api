import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', `testSchema-${schemaId}`)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)

  process.env.DATABASE_URL = databaseUrl

  execSync('pnpm prisma migrate dev')
})
afterAll(async () => {
 await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "testSchema-${schemaId}" CASCADE`)
 await prisma.$disconnect()
})
