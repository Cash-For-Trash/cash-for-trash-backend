import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (!process.env.VERCEL) {
  prisma
    .$connect()
    .then(() => {
      console.log("✅ Database Connected Successfully");
    })
    .catch((error) => {
      console.error("❌ Database Connection Warning:", error.message);
    });
}

export default prisma;