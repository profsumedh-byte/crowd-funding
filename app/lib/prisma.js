// import 'dotenv/config'
// import { PrismaClient } from '../generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaNeon } from '@prisma/adapter-neon';

// const prismaClientSingleton = () => {
//   const databaseUrl = process.env.DATABASE_URL;
//   if (!databaseUrl) {
//     throw new Error("DATABASE_URL environment variable is missing.");
//   }

//   const connectionString = process.env.DATABASE_URL;

//   // const Adapter = new PrismaNeon({connectionString})
//   // const adapter = new PrismaPg(connectionString);
//   const Adapter = new PrismaNeon({connectionString})
//   const adapter = new PrismaPg({Adapter});
//   return new PrismaClient({ adapter });
// };

// const globalForPrisma = globalThis;

// const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prismaGlobal = prisma;
// }

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}