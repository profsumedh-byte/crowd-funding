import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';
import { adapter } from 'next/dist/server/web/adapter';

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }

  const connectionString = process.env.DATABASE_URL;

  const Adapter = new PrismaNeon({connectionString})
  const adapter = new PrismaPg({Adapter});
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}

// const prismaClientSingleton = () => {
//   const databaseUrl = process.env.DATABASE_URL;
//   if (!databaseUrl) {
//     throw new Error("DATABASE_URL environment variable is missing.");
//   }

//   const connectionString = process.env.DATABASE_URL;

//   // const Adapter = new PrismaNeon({connectionString})
//   const adapter = new PrismaPg(connectionString);
//   return new PrismaClient({ adapter });
// };

// const globalForPrisma = globalThis;

// const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prismaGlobal = prisma;
// }
