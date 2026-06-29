const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetEmail = 'sohag.kazi97@gmail.com';
  
  const user = await prisma.user.findUnique({
    where: { email: targetEmail }
  });

  if (user) {
    await prisma.user.update({
      where: { email: targetEmail },
      data: { role: 'ADMIN' },
    });
    console.log(`Successfully made ${targetEmail} an ADMIN.`);
  } else {
    console.log(`User ${targetEmail} not found in the database. They must log in first.`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
