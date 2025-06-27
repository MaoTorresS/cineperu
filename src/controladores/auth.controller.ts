import { Request, Response } from 'express';
import { registrarUsuario, loginUsuario } from '../servicios/auth.service';

export const registro = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    const resultado = await registrarUsuario(nombre, correo, contraseña);
    res.status(201).json(resultado);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, contraseña } = req.body;
    const resultado = await loginUsuario(correo, contraseña);
    res.status(200).json(resultado);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
