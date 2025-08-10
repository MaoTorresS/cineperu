import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
/**
 * Middleware para verificar si el usuario es administrador.
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Función para pasar al siguiente middleware
 */

// Este middleware verifica si el usuario autenticado tiene el rol de administrador

export const isAdmin = (req: any, res: Response, next: NextFunction): void => {
  if (!req.usuario || req.usuario.rol !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso denegado: solo administradores.' });
    return;
  }
  next();
};

