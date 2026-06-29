const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findUnique({ where: { email: 'sohag.kazi97@gmail.com' } });
  if (!user) {
    console.log('User not found.');
    return;
  }
  
  const txs = await prisma.transaction.findMany({ where: { userId: user.id } });
  
  if (txs.length === 0) {
    console.log('No transactions found to cancel.');
  } else {
    for (const tx of txs) {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { status: 'FAILED' }
      });
      console.log('Cancelled transaction', tx.tranId);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
