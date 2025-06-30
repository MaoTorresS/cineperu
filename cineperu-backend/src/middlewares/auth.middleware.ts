import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const protegerRuta: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecreto123');
    (req as any).usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
  
};

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: string; rol: string };
    }
  }
}