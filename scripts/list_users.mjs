import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();

let users = await prisma.user.findMany();

for (const user of users) {
  console.log('# ' + user.email);
  console.log('Admin: ' + user.admin);
}
