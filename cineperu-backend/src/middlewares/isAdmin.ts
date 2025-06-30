import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
/**
 * Middleware para verificar si el usuario es administrador.
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Función para pasar al siguiente middleware
 */

export const isAdmin = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.usuario.id; 
    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!user || user.rol !== "admin") {
      res.status(403).json({ error: "Acceso denegado: solo administradores." });
      return; // Early return without value
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error en verificación de administrador." });
    return; // Early return without value
  }
};
// Exportamos el middleware para usarlo en otras partes de la aplicación