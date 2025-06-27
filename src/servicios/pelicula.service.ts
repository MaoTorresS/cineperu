// src/servicios/pelicula.service.ts
import { prisma } from '../prisma/client';
import type { Pelicula as PeliculaPrisma } from '@prisma/client';

export const crearPelicula = (pelicula: Omit<PeliculaPrisma, 'id' | 'creada_en'>) => {
  return prisma.pelicula.create({
    data: pelicula,
  });
};

export const listarPeliculas = () => {
  return prisma.pelicula.findMany({
    orderBy: {
      creada_en: 'desc',
    },
  });
};

export const obtenerPelicula = (id: string) => {
  return prisma.pelicula.findUnique({
    where: { id },
  });
};

export const editarPelicula = (id: string, datos: Partial<PeliculaPrisma>) => {
  return prisma.pelicula.update({
    where: { id },
    data: datos,
  });
};

export const borrarPelicula = (id: string) => {
  return prisma.pelicula.delete({
    where: { id },
  });
};
export const buscarPeliculasPorTitulo = (titulo: string) => {
  return prisma.pelicula.findMany({
    where: {
      titulo: {
        contains: titulo,
        mode: 'insensitive',
      },
    },
    orderBy: {
      creada_en: 'desc',
    },
  });
};