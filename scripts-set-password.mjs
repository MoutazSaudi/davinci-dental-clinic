import { PrismaClient } from "@prisma/client";
import { createPasswordRecord } from "./src/lib/auth/password.ts";

const prisma = new PrismaClient();

const username = process.env.NEW_USERNAME || "admin";
const password = process.env.NEW_PASSWORD;

if (!password) {
  console.error("Set NEW_PASSWORD env variable.");
  process.exit(1);
}

const passwordHash = createPasswordRecord(password);

const user = await prisma.adminUser.update({
  where: { username },
  data: { passwordHash },
});

console.log(`Password updated for username: ${user.username}`);
await prisma.$disconnect();
