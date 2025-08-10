import { prisma } from '../prisma/client';

export const agregarAlCarrito = async (
  usuario_id: string,
  pelicula_id: string,
  tipo: 'COMPRA' | 'ALQUILER',
  cantidad: number = 1
) => {
  // Verificar si ya existe en el carrito
  const existente = await prisma.carrito.findFirst({
    where: { usuario_id, pelicula_id, tipo },
  });
  if (existente) {
    throw new Error('La película ya está en el carrito');
  }
  return prisma.carrito.create({
    data: { usuario_id, pelicula_id, tipo, cantidad },
    include: { pelicula: true },
  });
};

export const listarCarrito = (usuario_id: string) => {
  return prisma.carrito.findMany({
    where: { usuario_id },
    include: { pelicula: true },
    orderBy: { fecha_agregado: 'desc' },
  });
};

export const eliminarDelCarrito = async (usuario_id: string, carrito_id: string) => {
  const item = await prisma.carrito.findUnique({ where: { id: carrito_id } });
  if (!item || item.usuario_id !== usuario_id) {
    throw new Error('No autorizado o ítem no encontrado');
  }
  return prisma.carrito.delete({ where: { id: carrito_id } });
};

export const limpiarCarrito = (usuario_id: string) => {
  return prisma.carrito.deleteMany({ where: { usuario_id } });
};

// Finalizar compra/alquiler: crea compras/alquileres y transacciones, limpia el carrito
type FinalizarCarritoResult = {
  compras: any[];
  alquileres: any[];
  transacciones: any[];
};

export const finalizarCarrito = async (usuario_id: string): Promise<FinalizarCarritoResult> => {
  const items = await prisma.carrito.findMany({
    where: { usuario_id },
    include: { pelicula: true },
  });
  if (!items.length) throw new Error('El carrito está vacío');

  const compras: any[] = [];
  const alquileres: any[] = [];
  const transacciones: any[] = [];

  for (const item of items) {
    if (item.tipo === 'COMPRA') {
      // Verificar si ya compró
      const ya = await prisma.compra.findFirst({ where: { usuario_id, pelicula_id: item.pelicula_id } });
      if (!ya) {
        const compra = await prisma.compra.create({
          data: {
            usuario_id,
            pelicula_id: item.pelicula_id,
            cantidad: item.cantidad,
            monto: item.pelicula.precio_compra,
          },
        });
        compras.push(compra);
        const trans = await prisma.transaccion.create({
          data: {
            usuario_id,
            pelicula_id: item.pelicula_id,
            tipo: 'COMPRA',
            monto: item.pelicula.precio_compra,
            estado_pago: 'EXITOSO',
          },
        });
        transacciones.push(trans);
      }
    } else if (item.tipo === 'ALQUILER') {
      // Verificar si ya tiene alquiler vigente
      const hoy = new Date();
      const vigente = await prisma.alquiler.findFirst({
        where: {
          usuario_id,
          pelicula_id: item.pelicula_id,
          fecha_fin: { gte: hoy },
        },
      });
      if (!vigente) {
        const fecha_inicio = new Date();
        const fecha_fin = new Date(fecha_inicio);
        fecha_fin.setDate(fecha_inicio.getDate() + 7);
        const alquiler = await prisma.alquiler.create({
          data: {
            usuario_id,
            pelicula_id: item.pelicula_id,
            fecha_inicio,
            fecha_fin,
            dias_alquiler: 7,
            estado: 'PENDIENTE',
          },
        });
        alquileres.push(alquiler);
        const trans = await prisma.transaccion.create({
          data: {
            usuario_id,
            pelicula_id: item.pelicula_id,
            tipo: 'ALQUILER',
            monto: item.pelicula.precio_alquiler,
            estado_pago: 'EXITOSO',
          },
        });
        transacciones.push(trans);
      }
    }
  }
  await prisma.carrito.deleteMany({ where: { usuario_id } });
  return { compras, alquileres, transacciones };
};
