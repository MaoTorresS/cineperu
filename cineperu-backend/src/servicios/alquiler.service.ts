import { prisma } from '../prisma/client';
import { differenceInDays, isAfter, addDays } from 'date-fns';

export const obtenerAlquileresPorUsuario = async (usuario_id: string) => {
  const alquileres = await prisma.alquiler.findMany({
    where: { usuario_id },
    include: { pelicula: true },
    orderBy: { fecha_inicio: 'desc' },
  });

  return alquileres.map((alquiler) => {
    const hoy = new Date();
    const estaVigente = isAfter(new Date(alquiler.fecha_fin), hoy);
    const diasRestantes = estaVigente ? differenceInDays(new Date(alquiler.fecha_fin), hoy) : 0;

    return {
      ...alquiler,
      estado: estaVigente ? 'vigente' : 'vencido',
      dias_restantes: diasRestantes,
    };
  });
};

// CAMBIO: Alquiler automático por 7 días
export const crearAlquiler = async (
  usuario_id: string,
  pelicula_id: string
) => {
  // Obtener la película para el precio
  const pelicula = await prisma.pelicula.findUnique({
    where: { id: pelicula_id },
  });

  if (!pelicula) {
    throw new Error('Película no encontrada');
  }

  // Verificar si ya tiene un alquiler vigente de esta película
  const alquilerExistente = await prisma.alquiler.findFirst({
    where: {
      usuario_id,
      pelicula_id,
      fecha_fin: {
        gte: new Date() // Fecha fin mayor a hoy
      }
    }
  });

  if (alquilerExistente) {
    throw new Error('Ya tienes un alquiler vigente de esta película');
  }

  // Calcular fecha fin automáticamente (7 días desde hoy)
  const fechaInicio = new Date();
  const fechaFin = addDays(fechaInicio, 7);

  const alquiler = await prisma.alquiler.create({
    data: {
      usuario_id,
      pelicula_id,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    },
    include: {
      pelicula: true
    }
  });

  // Registrar transacción
  await prisma.transaccion.create({
    data: {
      usuario_id,
      pelicula_id,
      tipo: 'alquiler',
      monto: pelicula.precio_alquiler,
      estado_pago: 'exitoso',
    },
  });

  return alquiler;
};
