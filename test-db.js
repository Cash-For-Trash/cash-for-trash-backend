import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.$connect()
  .then(() => console.log('✅ Database Connected Successfully'))
  .catch(e => console.error('❌ Error:', e.message))
  .finally(() => prisma.$disconnect());
