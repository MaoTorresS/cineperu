import { PrismaClient } from '@prisma/client';

// Configuración para diferentes entornos
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

// En desarrollo, reutilizar la conexión para evitar múltiples instancias
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Manejar el cierre graceful de la aplicación
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
