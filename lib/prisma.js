import { PrismaClient, Prisma } from "./generated/prisma/client";




// Prevent multiple instances in development (Next.js hot reload)
export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
