import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Middleware para proteger rutas que requieren autenticación
// Este middleware verifica si el token JWT está presente y es válido
export const protegerRuta: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

// Verificamos que el token esté en el formato "Bearer <token>"
// Tiempo de expiración del token: 1 hora
const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecreto123');
    (req as any).usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
};

// Middleware para verificar si el usuario es administrador
// Este middleware se utiliza para proteger rutas que solo deben ser accesibles por administradores
declare global {
  namespace Express {
    interface Request {
      usuario?: { id: string; rol: string };
    }
  }
}