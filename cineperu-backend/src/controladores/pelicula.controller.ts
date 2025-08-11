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
    // Si se subió archivo, guardar la ruta pública
    if (req.file) {
      // Cloudinary: la URL pública está en req.file.path
      data.portada_url = req.file.path;
    }
    // Convertir campos numéricos y fecha
    if (data.duracion_minutos !== undefined) data.duracion_minutos = Number(data.duracion_minutos);
    if (data.cantidad !== undefined) data.cantidad = Number(data.cantidad);
    if (data.precio_compra !== undefined) data.precio_compra = Number(data.precio_compra);
    if (data.precio_alquiler !== undefined) data.precio_alquiler = Number(data.precio_alquiler);
    if (data.fecha_estreno) data.fecha_estreno = new Date(data.fecha_estreno);
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
    // Si se subió archivo, guardar la ruta pública
    if (req.file) {
      // Cloudinary: la URL pública está en req.file.path
      datos.portada_url = req.file.path;
    }
    // Convertir campos numéricos y fecha
    if (datos.duracion_minutos !== undefined) datos.duracion_minutos = Number(datos.duracion_minutos);
    if (datos.cantidad !== undefined) datos.cantidad = Number(datos.cantidad);
    if (datos.precio_compra !== undefined) datos.precio_compra = Number(datos.precio_compra);
    if (datos.precio_alquiler !== undefined) datos.precio_alquiler = Number(datos.precio_alquiler);
    if (datos.fecha_estreno) datos.fecha_estreno = new Date(datos.fecha_estreno);
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
