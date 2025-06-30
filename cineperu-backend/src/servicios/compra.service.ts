// src/servicios/compra.service.ts
import { prisma } from '../prisma/client';
import { Compra } from '@prisma/client';

export const crearCompra = async (
  usuario_id: string,
  pelicula_id: string
): Promise<Compra> => {
  // Obtener la película
  const pelicula = await prisma.pelicula.findUnique({
    where: { id: pelicula_id },
  });

  if (!pelicula) {
    throw new Error('Película no encontrada');
  }

  // Verificar si ya compró esta película
  const compraExistente = await prisma.compra.findFirst({
    where: {
      usuario_id,
      pelicula_id,
    }
  });

  if (compraExistente) {
    throw new Error('Ya has comprado esta película');
  }

  // Crear la compra
  const compra = await prisma.compra.create({
    data: {
      usuario_id,
      pelicula_id,
      monto: pelicula.precio_compra,
    },
    include: {
      pelicula: true
    }
  });

  // Registrar transacción asociada
  await prisma.transaccion.create({
    data: {
      usuario_id,
      pelicula_id,
      tipo: 'compra',
      monto: pelicula.precio_compra,
      estado_pago: 'exitoso',
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
