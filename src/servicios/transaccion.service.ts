import { prisma } from '../prisma/client';
import { Transaccion } from '@prisma/client';

export const registrarTransaccion = async (
  usuario_id: string,
  pelicula_id: string,
  tipo: 'compra' | 'alquiler',
  monto: number,
  estado_pago: 'exitoso' | 'fallido'
): Promise<Transaccion> => {
  return prisma.transaccion.create({
    data: {
      usuario_id,
      pelicula_id,
      tipo,
      monto,
      estado_pago,
    },
  });
};

export const obtenerTransaccionesUsuario = (usuario_id: string): Promise<Transaccion[]> => {
  return prisma.transaccion.findMany({
    where: { usuario_id },
    include: {
      pelicula: true,
    },
    orderBy: {
      fecha_transaccion: 'desc',
    },
  });
};
