// Endpoint: POST /api/usuarios/registrar
export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, correo, contraseña } = req.body;
    if (!nombre || !apellido || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }
    // Verificar si el correo ya existe
    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }
    // Encriptar contraseña
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(contraseña, 10);
    const usuario = await prisma.usuario.create({
      data: { nombre, apellido, correo, contraseña: hash }
    });
    // No devolver la contraseña
    const { contraseña: _, ...usuarioSinPass } = usuario;
    res.status(201).json(usuarioSinPass);
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { obtenerAlquileresPorUsuario } from '../servicios/alquiler.service';
import { obtenerComprasPorUsuario } from '../servicios/compra.service';
import { obtenerTransaccionesUsuario } from '../servicios/transaccion.service';
import * as usuarioService from '../servicios/usuario.service';
// Listar todos los usuarios (solo admin)
export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

// Editar usuario (solo admin)
export const editarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuario = await usuarioService.editarUsuario(id, data);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar usuario' });
  }
};

// Bloquear/desbloquear usuario (solo admin)
export const cambiarEstadoUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    if (typeof activo !== 'boolean') return res.status(400).json({ mensaje: 'El campo activo es requerido (boolean)' });
    const usuario = await usuarioService.cambiarEstadoUsuario(id, activo);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado de usuario' });
  }
};

// Eliminar usuario (solo admin)
export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.eliminarUsuario(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};

// Endpoint: GET /api/usuarios/perfil
export const perfilUsuario = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.usuario?.id;
    if (!usuario_id) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }

    // Datos personales
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuario_id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        imagen_perfil: true,
        rol: true,
        fecha_creacion: true,
      }
    });

    // Historial
    const [alquileres, compras, transacciones] = await Promise.all([
      obtenerAlquileresPorUsuario(usuario_id),
      obtenerComprasPorUsuario(usuario_id),
      obtenerTransaccionesUsuario(usuario_id)
    ]);

    res.json({ usuario, alquileres, compras, transacciones });
  } catch (error) {
    console.error('Error en perfilUsuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
