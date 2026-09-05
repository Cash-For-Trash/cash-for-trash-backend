import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
  }
}

connectDB();

export default prisma;