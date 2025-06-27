// src/servicios/compra.service.ts
import { prisma } from '../prisma/client';
import { Compra } from '@prisma/client';

export const crearCompra = async (
  usuario_id: string,
  pelicula_id: string,
  monto: number
): Promise<Compra> => {
  // 1. Crear la compra
  const compra = await prisma.compra.create({
    data: {
      usuario_id,
      pelicula_id,
      monto,
    },
  });

  // 2. Registrar transacción asociada
  await prisma.transaccion.create({
    data: {
      usuario_id,
      pelicula_id,
      tipo: 'compra',
      monto,
      estado_pago: 'exitoso', // puede cambiarse si se usa una pasarela real
    },
  });

  return compra;
};

export const obtenerComprasPorUsuario = (usuario_id: string) => {
  return prisma.compra.findMany({
    where: { usuario_id },
    include: {
      pelicula: true,
    },
    orderBy: {
      fecha_compra: 'desc',
    },
  });
};
