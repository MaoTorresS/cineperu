import { Request, Response } from 'express';
import { registrarUsuario, loginUsuario } from '../servicios/auth.service';


export const registro = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, correo, contraseña, repetirContraseña } = req.body;
    if (!nombre || !apellido || !correo || !contraseña || !repetirContraseña) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    if (contraseña !== repetirContraseña) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }
    const resultado = await registrarUsuario(nombre, apellido, correo, contraseña);
    res.status(201).json(resultado);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { correo } = req.body;
    const contraseña = req.body.contraseña || req.body.contrasena || req.body.password;
    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }
    const resultado = await loginUsuario(correo, contraseña);
    res.status(200).json(resultado);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Recuperar contraseña (sin email, solo cambio directo)
export const recuperarPassword = async (req: Request, res: Response) => {
  try {
    const correo = req.body.correo;
    // Permitir los campos nueva/nuevaContraseña y repetir/repetirContraseña
    const nueva = req.body.nueva || req.body.nuevaContraseña;
    const repetir = req.body.repetir || req.body.repetirContraseña;
    if (!correo || !nueva || !repetir) {
      return res.status(400).json({ error: 'Correo, nueva contraseña y repetición son requeridos' });
    }
    if (nueva !== repetir) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }
    // Buscar usuario
    const usuario = await require('../servicios/auth.service').buscarUsuarioPorCorreo(correo);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await require('../servicios/auth.service').actualizarPassword(correo, nueva);
    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
