import { prisma } from '../prisma/client';

export const registrarTransaccion = async (
  usuario_id: string,
  pelicula_id: string,
  tipo: 'compra' | 'alquiler',
  monto: number,
  estado_pago: 'exitoso' | 'fallido'
): Promise<any> => {
  return prisma.transaccion.create({
    data: {
      usuario_id,
      pelicula_id,
      tipo: tipo === 'alquiler' ? 'ALQUILER' : 'COMPRA',
      monto,
      estado_pago: estado_pago === 'exitoso' ? 'EXITOSO' : 'CANCELADO',
    },
  });
};

export const obtenerTransaccionesUsuario = (usuario_id: string) => {
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
