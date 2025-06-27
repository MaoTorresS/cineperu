import { Request, Response } from 'express';
import * as transaccionService from '../servicios/transaccion.service';

export const crearTransaccion = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    const { pelicula_id, tipo, monto, estado_pago } = req.body;

    if (!usuario_id || !pelicula_id || !tipo || !monto || !estado_pago) {
      return res.status(400).json({ mensaje: 'Faltan datos para registrar transacción' });
    }

    const transaccion = await transaccionService.registrarTransaccion(
      usuario_id,
      pelicula_id,
      tipo,
      monto,
      estado_pago
    );

    res.status(201).json(transaccion);
  } catch (error) {
    console.error('Error al registrar transacción:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const listarTransaccionesUsuario = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) {
      return res.status(400).json({ mensaje: 'Usuario no autenticado' });
    }

    const transacciones = await transaccionService.obtenerTransaccionesUsuario(usuario_id);
    res.json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
