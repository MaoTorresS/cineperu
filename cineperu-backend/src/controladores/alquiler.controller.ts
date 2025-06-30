import { Request, Response } from 'express';
import * as alquilerService from '../servicios/alquiler.service';

export const alquilarPelicula = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { pelicula_id } = req.body;

    if (!usuario_id || !pelicula_id) {
      return res.status(400).json({ 
        mensaje: 'ID de película es requerido' 
      });
    }

    const alquiler = await alquilerService.crearAlquiler(
      usuario_id,
      pelicula_id
    );

    res.status(201).json({
      mensaje: 'Película alquilada exitosamente por 7 días',
      alquiler
    });
  } catch (error: any) {
    console.error('Error al alquilar película:', error);
    if (error.message === 'Película no encontrada' || 
        error.message === 'Ya tienes un alquiler vigente de esta película') {
      return res.status(400).json({ mensaje: error.message });
    }
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
