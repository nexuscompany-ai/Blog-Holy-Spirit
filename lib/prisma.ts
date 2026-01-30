import { PrismaClient } from '@prisma/client';

// O PrismaClient não deve ser instanciado no navegador.
// Esta verificação evita que o frontend quebre ao importar arquivos que usam o prisma.
const isServer = typeof window === 'undefined';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

if (isServer) {
  if (process.env.NODE_ENV === 'production') {
    prismaInstance = new PrismaClient();
  } else {
    // Accessing the global object using globalThis instead of the Node-specific global to avoid compilation errors.
    if (!globalThis.prisma) {
      globalThis.prisma = new PrismaClient();
    }
    prismaInstance = globalThis.prisma;
  }
} else {
  // Mock ou erro controlado para o frontend
  prismaInstance = {} as PrismaClient;
}

export const prisma = prismaInstance;