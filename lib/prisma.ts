
import { PrismaClient } from '@prisma/client';

/**
 * SCHEMA REFERENCE FOR SUPABASE (POSTGRESQL):
 * 
 * model Post {
 *   id          String    @id @default(uuid())
 *   title       String
 *   slug        String    @unique
 *   excerpt     String
 *   content     String
 *   category    String
 *   image       String
 *   createdAt   DateTime  @default(now())
 *   published   Boolean   @default(true)
 *   publishedAt DateTime?
 *   source      String    // "manual" | "ai"
 * }
 * 
 * model Event {
 *   id          String    @id @default(uuid())
 *   title       String
 *   date        String
 *   time        String
 *   location    String
 *   description String
 *   category    String
 *   status      String    // "active" | "inactive"
 *   image       String?
 * }
 * 
 * model Settings {
 *   id        String @id @default(uuid())
 *   gymName   String
 *   phone     String
 *   instagram String
 *   address   String
 *   website   String
 * }
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
