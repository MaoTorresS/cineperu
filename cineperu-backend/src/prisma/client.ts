import { PrismaClient } from '@prisma/client';

// Configuración para diferentes entornos
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Crear una instancia de PrismaClient
// Si ya existe una instancia en el entorno global, reutilizarla
export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

// Si no estamos en producción, asignar la instancia de Prisma al objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Desconectar Prisma al finalizar el proceso
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
