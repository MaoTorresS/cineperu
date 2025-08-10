import { Request, Response } from 'express';
import * as peliculaService from '../servicios/pelicula.service';


// Controlador para listar películas con paginación y búsqueda
export const listarPeliculas = async (req: Request, res: Response) => {
  const { page = 1, limit = 40, search = '', genero = '' } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 40;
  const offset = (pageNum - 1) * limitNum;

  const { peliculas, total } = await peliculaService.listarPeliculas({
    search: search as string,
    genero: genero as string,
    skip: offset,
    take: limitNum,
  });

  res.json({
    peliculas,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
};

// Controlador para obtener una película por ID
export const obtenerPelicula = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pelicula = await peliculaService.obtenerPelicula(id);
  if (!pelicula) {
    return res.status(404).json({ mensaje: 'Película no encontrada' });
  }
  res.json(pelicula);
};

// Controlador para registrar una nueva película
export const registrarPelicula = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const nueva = await peliculaService.crearPelicula(data);
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear película:', error);
    res.status(500).json({ mensaje: 'Error interno al crear película' });
  }
};

// Controlador para editar una película
// Recibe el ID de la película a editar y los nuevos datos en el cuerpo de la solicitud
// Si la película no existe, devuelve un error 404
export const editarPelicula = async (req: Request, res: Response) => {
  const { id } = req.params;
  const datos = req.body;
  try {
    const pelicula = await peliculaService.editarPelicula(id, datos);
    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json(pelicula);
  } catch (error) {
    console.error('Error al editar película:', error);
    res.status(500).json({ mensaje: 'Error al editar película' });
  }
};

// Controlador para borrar una película
// Recibe el ID de la película a eliminar en los parámetros de la solicitud
export const borrarPelicula = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await peliculaService.borrarPelicula(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar película:', error);
    res.status(500).json({ mensaje: 'Error al eliminar película' });
  }
};
