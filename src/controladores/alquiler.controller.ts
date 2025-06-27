import { Request, Response } from 'express';
import * as alquilerService from '../servicios/alquiler.service';

export const alquilarPelicula = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { pelicula_id, fecha_fin } = req.body;

    if (!usuario_id || !pelicula_id || !fecha_fin) {
      return res.status(400).json({ mensaje: 'Datos incompletos para alquilar' });
    }

    const alquiler = await alquilerService.crearAlquiler(
      usuario_id,
      pelicula_id,
      new Date(fecha_fin)
    );

    res.status(201).json(alquiler);
  } catch (error) {
    console.error('Error al alquilar película:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const listarAlquileresUsuario = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) {
      return res.status(400).json({ mensaje: 'ID de usuario no proporcionado' });
    }
    const alquileres = await alquilerService.obtenerAlquileresPorUsuario(usuario_id);
    res.json(alquileres);
  } catch (error) {
    console.error('Error al obtener alquileres:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
