import { Request, Response } from 'express';
import * as compraService from '../servicios/compra.service';

export const comprarPelicula = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { pelicula_id } = req.body;

    if (!usuario_id || !pelicula_id) {
      return res.status(400).json({ 
        mensaje: 'ID de película es requerido' 
      });
    }

    const compra = await compraService.crearCompra(usuario_id, pelicula_id);
    res.status(201).json({
      mensaje: 'Película comprada exitosamente',
      compra
    });
  } catch (error: any) {
    console.error('Error al comprar película:', error);
    if (error.message === 'Película no encontrada' || 
        error.message === 'Ya has comprado esta película') {
      return res.status(400).json({ mensaje: error.message });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const listarComprasUsuario = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }

    const compras = await compraService.obtenerComprasPorUsuario(usuario_id);
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
