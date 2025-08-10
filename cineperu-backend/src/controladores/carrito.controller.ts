import { Request, Response } from 'express';
import * as carritoService from '../servicios/carrito.service';

export const agregarAlCarrito = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { pelicula_id, tipo, cantidad } = req.body;
    if (!usuario_id || !pelicula_id || !tipo) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }
    const item = await carritoService.agregarAlCarrito(usuario_id, pelicula_id, tipo, cantidad);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const listarCarrito = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) return res.status(401).json({ mensaje: 'No autenticado' });
    const items = await carritoService.listarCarrito(usuario_id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
};

export const eliminarDelCarrito = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { id } = req.params;
    if (!usuario_id || !id) return res.status(400).json({ mensaje: 'Faltan datos' });
    await carritoService.eliminarDelCarrito(usuario_id, id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const limpiarCarrito = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) return res.status(401).json({ mensaje: 'No autenticado' });
    await carritoService.limpiarCarrito(usuario_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno' });
  }
};

export const finalizarCarrito = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) return res.status(401).json({ mensaje: 'No autenticado' });
    const resultado = await carritoService.finalizarCarrito(usuario_id);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};
