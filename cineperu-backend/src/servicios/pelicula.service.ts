// src/servicios/pelicula.service.ts

import { prisma } from '../prisma/client';


// Crear una película
export const crearPelicula = (pelicula: any) => {
  return prisma.pelicula.create({
    data: pelicula,
    include: { genero: true },
  });
};


// Listar películas con paginación y búsqueda flexible
interface ListarPeliculasParams {
  search?: string;
  genero?: string;
  skip?: number;
  take?: number;
}

export const listarPeliculas = async (params: ListarPeliculasParams = {}) => {
  const { search = '', genero = '', skip = 0, take = 40 } = params;
  const where: any = {};
  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: 'insensitive' } },
      { director: { contains: search, mode: 'insensitive' } },
      { genero: { nombre: { contains: search, mode: 'insensitive' } } },
    ];
  }
  if (genero) {
    where.genero = { nombre: { equals: genero, mode: 'insensitive' } };
  }
  const [peliculas, total] = await Promise.all([
    prisma.pelicula.findMany({
      where,
      include: { genero: true },
      orderBy: [{ fecha_estreno: 'desc' }],
      skip,
      take,
    }),
    prisma.pelicula.count({ where })
  ]);
  return { peliculas, total };
};

// Obtener una película por ID (con género)
export const obtenerPelicula = (id: string) => {
  return prisma.pelicula.findUnique({
    where: { id },
    include: { genero: true },
  });
};

// Actualizar una película
export const editarPelicula = (id: string, datos: any) => {
  return prisma.pelicula.update({
    where: { id },
    data: datos,
    include: { genero: true },
  });
};

// Borrar una película
export const borrarPelicula = (id: string) => {
  return prisma.pelicula.delete({
    where: { id },
  });
};

// Buscar películas por título, director o género (un solo buscador)
export const buscarPeliculas = (query: string) => {
  return prisma.pelicula.findMany({
    where: {
      OR: [
        { titulo: { contains: query, mode: 'insensitive' } },
        { director: { contains: query, mode: 'insensitive' } },
        { genero: { nombre: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: { genero: true },
    orderBy: [{ fecha_estreno: 'desc' }],
  });
};

// Listar todos los géneros
export const listarGeneros = () => {
  return prisma.genero.findMany({
    orderBy: { nombre: 'asc' },
  });
};