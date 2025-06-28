import { prisma } from '../prisma/client';
import { differenceInDays, isAfter } from 'date-fns';

export const obtenerAlquileresPorUsuario = async (usuario_id: string) => {
  const alquileres = await prisma.alquiler.findMany({
    where: { usuario_id },
    include: { pelicula: true },
    orderBy: { fecha_inicio: 'desc' },
  });

  return alquileres.map((alquiler) => {
    const hoy = new Date();
    const estaVigente = isAfter(new Date(alquiler.fecha_fin), hoy);
    const diasRestantes = differenceInDays(new Date(alquiler.fecha_fin), hoy);

    return {
      ...alquiler,
      estado: estaVigente ? 'vigente' : 'vencido',
      dias_restantes: estaVigente ? diasRestantes : 0,
    };
  });
};
//cambios 
export const crearAlquiler = async (
  usuario_id: string,
  pelicula_id: string,
  fecha_fin: Date
) => {
  const alquiler = await prisma.alquiler.create({
    data: {
      usuario_id,
      pelicula_id,
      fecha_fin,
    },
  });

  const pelicula = await prisma.pelicula.findUnique({
    where: { id: pelicula_id },
  });

  if (pelicula) {
    await prisma.transaccion.create({
      data: {
        usuario_id,
        pelicula_id,
        tipo: 'alquiler',
        monto: pelicula.precio_alquiler,
        estado_pago: 'exitoso',
      },
    });
  }

  return alquiler;
};
