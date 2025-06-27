import { Pelicula } from '../modelos/pelicula.model';
import { prisma } from '../prisma/client';

export const obtenerPeliculas = (): Promise<Pelicula[]> => {
  return prisma.pelicula.findMany({
    orderBy: { fecha_estreno: 'desc' },
  });
};

export const crearPelicula = (data: Omit<Pelicula, 'id' | 'creada_en'>): Promise<Pelicula> => {
  return prisma.pelicula.create({ data });
};

export const editarPelicula = (id: string, datos: any) => {
  return prisma.pelicula.update({
    where: { id },
    data: datos,
  });
};

export const eliminarPelicula = (id: string) => {
  return prisma.pelicula.delete({
    where: { id },
  });
};

export const listarPeliculas = (): Promise<Pelicula[]> => {
  return prisma.pelicula.findMany({
    orderBy: { fecha_estreno: 'desc' },
  });
};

export const obtenerPeliculaPorId = (id: string): Promise<Pelicula | null> => {
  return prisma.pelicula.findUnique({
    where: { id },
  });
};