import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME ?? "Il Cuore di Loco";

  if (!email || !password) {
    throw new Error(
      "OWNER_EMAIL and OWNER_PASSWORD must be set to seed the owner account."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await prisma.user.upsert({
    where: { email },
    update: { role: Role.OWNER, name, passwordHash },
    create: { email, name, passwordHash, role: Role.OWNER },
  });

  console.log(`✓ Owner account ready: ${owner.email} (role ${owner.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
