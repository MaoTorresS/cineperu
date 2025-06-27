import { Request, Response } from 'express';
import * as peliculaService from '../servicios/pelicula.service';

export const listarPeliculas = async (_req: Request, res: Response) => {
  const peliculas = await peliculaService.listarPeliculas();
  res.json(peliculas);
};

export const obtenerPelicula = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pelicula = await peliculaService.obtenerPeliculaPorId(id);
  if (!pelicula) {
    return res.status(404).json({ mensaje: 'Película no encontrada' });
  }
  res.json(pelicula);
};

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

export const borrarPelicula = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await peliculaService.eliminarPelicula(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar película:', error);
    res.status(500).json({ mensaje: 'Error al eliminar película' });
  }
};
