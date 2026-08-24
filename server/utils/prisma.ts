import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../prisma/generated/client'
import { env } from './env'

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3({
    url: env.DATABASE_URL,
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaGlobal = prisma
