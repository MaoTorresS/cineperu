import { Request, Response } from 'express';
import * as compraService from '../servicios/compra.service';

export const comprarPelicula = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { pelicula_id, monto } = req.body;

    if (!usuario_id || !pelicula_id || !monto) {
      return res.status(400).json({ mensaje: 'Datos incompletos para la compra' });
    }

    const compra = await compraService.crearCompra(usuario_id, pelicula_id, monto);
    res.status(201).json(compra);
  } catch (error) {
    console.error('Error al comprar película:', error);
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
