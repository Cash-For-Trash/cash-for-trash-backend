import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  const password = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      first_name: "Admin",
      last_name: "System",
      email: "admin@gmail.com",
      password: password,
      mobile: "01000000000",
      role: "admin",
      is_verified: true,
      is_active: true,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });