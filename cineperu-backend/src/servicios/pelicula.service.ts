// src/servicios/pelicula.service.ts
import { prisma } from '../prisma/client';
import type { Pelicula as PeliculaPrisma } from '@prisma/client';

//Crear una película
// Usamos Omit para excluir los campos 'id' y 'creada_en' que
export const crearPelicula = (pelicula: Omit<PeliculaPrisma, 'id' | 'creada_en'>) => {
  return prisma.pelicula.create({
    data: pelicula,
  });
};

// Listar todas las películas
// Ordenamos por fecha de creación de forma descendente
export const listarPeliculas = () => {
  return prisma.pelicula.findMany({
    orderBy: {
      creada_en: 'desc',
    },
  });
};

// Obtener una película
export const obtenerPelicula = (id: string) => {
  return prisma.pelicula.findUnique({
    where: { id },
  });
};

// Actualizar una película
// Usamos Partial para permitir que solo se actualicen algunos campos
export const editarPelicula = (id: string, datos: Partial<PeliculaPrisma>) => {
  return prisma.pelicula.update({
    where: { id },
    data: datos,
  });
};

// Borrar una película
// Usamos el método delete de Prisma para eliminar una película por su ID
export const borrarPelicula = (id: string) => {
  return prisma.pelicula.delete({
    where: { id },
  });
};

// Buscar películas por título
// Usamos el método findMany de Prisma con un filtro que busca títulos que contentengan
// el texto proporcionado, ignorando mayúsculas y minúsculas 
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